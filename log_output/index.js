const Koa = require('koa');

const app = new Koa();
const PORT = process.env.PORT || 3000;

const randomString = Math.random().toString(36).substring(2);

setInterval(() => {
    console.log(`${new Date().toISOString()}: ${randomString}`);
}, 5000);

app.use(async (ctx) => {
    ctx.body = `${new Date().toISOString()}: ${randomString}`;
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});