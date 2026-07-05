const Koa = require('koa');
const fs = require('fs');
const path = require('path');

const app = new Koa();

const PORT = process.env.PORT || 3000;

const directory = path.join('/', 'usr', 'src', 'app', 'files');

const logFile = path.join(directory, 'output.txt');
const pingFile = path.join(directory, 'pingpong.txt');

const read = (file, fallback) =>
    new Promise(resolve => {

        fs.readFile(file, 'utf8', (err, data) => {

            if (err) return resolve(fallback);

            resolve(data.trim());

        });

    });

app.use(async ctx => {

    if (ctx.path.includes('favicon.ico')) return;

    const log = await read(logFile, 'No log found');

    const pongs = await read(pingFile, '0');

    ctx.type = 'text/plain';

    ctx.body =
`${log}

Ping / Pongs: ${pongs}`;

});

console.log("Reader started");

app.listen(PORT);