const Koa = require('koa');
const { Pool } = require('pg');

const app = new Koa();

const PORT = process.env.PORT || 3001;

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

async function initializeDatabase() {

    console.log("Waiting for PostgreSQL...");

    while (true) {

        try {

            await pool.query("SELECT NOW()");
            break;

        } catch (err) {

            console.log("Postgres not ready, retrying in 2 seconds...");
            await new Promise(resolve => setTimeout(resolve, 2000));

        }

    }

    console.log("Connected to PostgreSQL");

    await pool.query(`
        CREATE TABLE IF NOT EXISTS counter (
            id INTEGER PRIMARY KEY,
            value INTEGER NOT NULL
        );
    `);

    await pool.query(`
        INSERT INTO counter(id, value)
        VALUES (1,0)
        ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Counter initialized");

}

initializeDatabase();

app.use(async (ctx) => {

    if (ctx.path === "/") {

        const result = await pool.query(`
            UPDATE counter
            SET value = value + 1
            WHERE id = 1
            RETURNING value;
        `);

        ctx.body = `pong ${result.rows[0].value}`;
        return;

    }

    if (ctx.path === "/pings") {

        const result = await pool.query(
            "SELECT value FROM counter WHERE id=1;"
        );

        ctx.body = `${result.rows[0].value}`;
        return;

    }

    ctx.status = 404;

});

app.listen(PORT, () => {

    console.log(`Ping Pong listening on ${PORT}`);

});