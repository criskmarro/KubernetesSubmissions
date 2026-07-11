const Koa = require('koa');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = new Koa();

const PORT = process.env.PORT || 3000;

const logFile = path.join('/usr/src/app/files', 'output.txt');

const infoFile = path.join('/usr/src/app/config', 'information.txt');

const MESSAGE = process.env.MESSAGE || '';

async function readLog() {

    try {

        return fs.readFileSync(logFile, 'utf8').trim();

    } catch {

        return 'No log available';

    }

}

async function readInfoFile() {

    try {

        return fs.readFileSync(infoFile, 'utf8').trim();

    } catch {

        return 'File not found';

    }

}

async function getPingCount() {

    try {

        const response = await axios.get('http://ping-pong-service/pings');

        return response.data;

    } catch (err) {

        return 'Unavailable';

    }

}

app.use(async (ctx) => {

    const log = await readLog();

    const info = await readInfoFile();

    const pings = await getPingCount();

    ctx.type = 'text/plain';

    ctx.body =
`file content: ${info}
env variable: MESSAGE=${MESSAGE}

${log}

Ping / Pongs: ${pings}`;
});

app.listen(PORT, () => {

    console.log("Reader started");

});