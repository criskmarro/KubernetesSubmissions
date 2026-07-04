const Koa = require('koa');

const app = new Koa();

const PORT = process.env.PORT || 3001;

let counter = 0;

app.use(async (ctx) => {

    if (ctx.path === '/pingpong') {

        counter++;

        ctx.body = `pong ${counter}`;

        return;
    }

    ctx.status = 404;
});

app.listen(PORT, () => {

    console.log(`Ping Pong running on ${PORT}`);

});