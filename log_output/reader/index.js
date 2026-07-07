const Koa = require('koa');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = new Koa();

const PORT = process.env.PORT || 3000;

const filePath = path.join('/', 'usr', 'src', 'app', 'files', 'output.txt');

async function readLog() {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch {
        return 'Log unavailable';
    }
}

async function getPings() {
    try {
        const response = await axios.get('http://ping-pong-service/pings');
        return response.data;
    } catch {
        return 'Unavailable';
    }
}

app.use(async ctx => {

    const log = await readLog();
    const pings = await getPings();

    ctx.type = 'text/plain';
    ctx.body =
`${log}

Ping / Pongs: ${pings}`;
});

app.listen(PORT);