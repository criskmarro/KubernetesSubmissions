const Koa = require('koa');
const fs = require('fs');
const path = require('path');

const app = new Koa();

const PORT = process.env.PORT || 3001;

const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'pingpong.txt');

fs.mkdirSync(directory, { recursive: true });

let counter = 0;

try {
    counter = Number(fs.readFileSync(filePath, 'utf8'));
} catch {
    counter = 0;
}

app.use(async ctx => {

    if (ctx.path !== '/pingpong') {

        ctx.status = 404;
        return;

    }

    counter++;

    fs.writeFileSync(filePath, counter.toString());

    ctx.body = `pong ${counter}`;

});

app.listen(PORT, () => {

    console.log(`Ping Pong running on ${PORT}`);

});