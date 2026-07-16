const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { Pool } = require('pg');

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

async function initializeDatabase() {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            text VARCHAR(140) NOT NULL
        );
    `);

    console.log("Database initialized");

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
        'SELECT text FROM todos ORDER BY id'
    );

    ctx.body = result.rows.map(row => row.text);

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

    await pool.query(
        'INSERT INTO todos(text) VALUES($1)',
        [text]
    );

    ctx.status = 201;

    ctx.body = {
        message: "Todo created"
    };

});

app.use(router.routes());

app.use(router.allowedMethods());

initializeDatabase()
.then(() => {

    app.listen(PORT, () => {

        console.log(`Todo Backend running on port ${PORT}`);

    });

})
.catch(err => {

    console.error(err);

});