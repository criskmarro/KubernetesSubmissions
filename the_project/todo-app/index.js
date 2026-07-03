const Koa = require('koa');

const app = new Koa();

const PORT = process.env.PORT || 8080;

const startingString = Math.random().toString(36).substring(2, 8);

console.log(`Started with ${startingString}`);

app.use(async (ctx) => {
  if (ctx.path.includes('favicon.ico')) return;

  console.log(
    `[${new Date().toISOString()}] Request received`
  );

  ctx.type = 'html';

  ctx.body = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Todo App</title>
      </head>
      <body>
        <h1>Todo App</h1>

        <p>The application is running inside Kubernetes!</p>

        <hr>

        <strong>Startup ID:</strong> ${startingString}<br>
        <strong>Timestamp:</strong> ${new Date().toISOString()}
      </body>
    </html>
  `;
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});