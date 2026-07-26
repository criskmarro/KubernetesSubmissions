const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { Pool } = require('pg');
const { connect } = require('@nats-io/transport-node');

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 3000;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

let isHealthy = true;
let isNatsHealthy = false;
let natsConnection;

const natsEncoder = new TextEncoder();
const NATS_URL = process.env.NATS_URL || 'nats://nats-service:4222';
const TODO_STATUS_SUBJECT = 'todos.status';


async function initializeDatabase() {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            text VARCHAR(140) NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        );
    `);

    console.log("Database initialized");

}

async function connectToNats() {

    natsConnection = await connect({ servers: NATS_URL });
    isNatsHealthy = true;

    console.log(`Connected to NATS at ${NATS_URL}`);

    (async () => {
        for await (const status of natsConnection.status()) {
            if (status.type === 'disconnect') {
                isNatsHealthy = false;
            }

            if (status.type === 'reconnect') {
                isNatsHealthy = true;
            }
        }
    })().catch(err => console.error('NATS status monitor failed:', err.message));

    natsConnection.closed().then((err) => {
        isNatsHealthy = false;
        console.error('NATS connection closed:', err ? err.message : 'closed');
    });

}

function publishTodoStatus(type, todo) {

    if (!isNatsHealthy) {
        // Todo updates must still succeed when NATS is temporarily unavailable.
        // Core NATS is at-most-once, so skipping an unavailable publish avoids retries
        // that could result in duplicate chat messages.
        console.warn(`NATS unavailable; skipped ${type} for todo ${todo.id}`);
        return;
    }

    try {
        natsConnection.publish(
            TODO_STATUS_SUBJECT,
            natsEncoder.encode(JSON.stringify({ type, todo }))
        );

        console.log(`Published ${type} for todo ${todo.id}`);
    } catch (err) {
        console.error(`Unable to publish ${type} for todo ${todo.id}:`, err.message);
    }

}

app.use(async (ctx, next) => {

    const start = Date.now();

    console.log(`${ctx.method} ${ctx.url}`);

    await next();

    const duration = Date.now() - start;

    console.log(`${ctx.method} ${ctx.url} -> ${ctx.status} (${duration} ms)`);

});

app.use(bodyParser());

router.get('/todos', async (ctx) => {

    console.log("Fetching todos");

    const result = await pool.query(
        "SELECT id, text, done FROM todos ORDER BY id;"
    );

    ctx.body = result.rows;

});

router.post('/todos', async (ctx) => {

    const { text } = ctx.request.body;

    if (!text) {

        console.log("Rejected todo: empty");

        ctx.status = 400;
        ctx.body = {
            error: "Todo cannot be empty"
        };

        return;

    }

    if (text.length > 140) {

        console.log(
            `Rejected todo (${text.length} chars): ${text}`
        );

        ctx.status = 400;
        ctx.body = {
            error: "Todo too long"
        };

        return;

    }

    console.log(`Creating todo: ${text}`);

    const result = await pool.query(
        'INSERT INTO todos(text) VALUES($1) RETURNING id, text, done',
        [text]
    );

    publishTodoStatus('todo.created', result.rows[0]);

    ctx.status = 201;

    ctx.body = {
        message: "Todo created"
    };

});

router.post('/break', async (ctx) => {
    isHealthy = false;

    ctx.body = { status: "broken" };

    return;
});

router.put("/todos/:id", async (ctx) => {

    const id = ctx.params.id;

    const result = await pool.query(
        `
        UPDATE todos
        SET done = TRUE
        WHERE id = $1
        RETURNING id, text, done
        `,
        [id]
    );

    if (result.rowCount === 0) {
        ctx.status = 404;
        ctx.body = { error: 'Todo not found' };
        return;
    }

    publishTodoStatus('todo.completed', result.rows[0]);

    ctx.status = 204;

});

router.get('/healthz', async (ctx) => {
    if (!isHealthy || !isNatsHealthy) {
        ctx.status = 500;
        ctx.body = "Unhealthy";
        return;
    }

    try {
        await pool.query("SELECT 1");
        ctx.status = 200;
        ctx.body = "OK";
    } catch {
        ctx.status = 500;
        ctx.body = "Database unavailable";
    }
});

app.use(router.routes());

app.use(router.allowedMethods());

Promise.all([initializeDatabase(), connectToNats()])
    .then(() => {

        app.listen(PORT, () => {

            console.log(`Todo Backend running on port ${PORT}`);

        });

    })
    .catch(err => {

        console.error(err);
        process.exit(1);

    });
