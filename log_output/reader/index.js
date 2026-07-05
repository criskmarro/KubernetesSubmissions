const Koa = require('koa');
const fs = require('fs');
const path = require('path');

const app = new Koa();

const PORT = process.env.PORT || 3000;

const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'output.txt');

const readFile = () =>
  new Promise((resolve) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return resolve('Log file not found.');
      }

      resolve(data);
    });
  });

app.use(async (ctx) => {
  if (ctx.path.includes('favicon.ico')) return;

  ctx.type = 'text/plain';
  ctx.body = await readFile();
});

console.log("Reader started");

app.listen(PORT);