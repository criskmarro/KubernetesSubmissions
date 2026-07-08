const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 3000;

// In-memory storage
const todos = [
  "Learn JavaScript",
  "Learn Kubernetes",
  "Finish DevOps course"
];

router.get('/todos', (ctx) => {
  ctx.body = todos;
});

router.post('/todos', (ctx) => {
  const { text } = ctx.request.body;

  if (!text) {
    ctx.status = 400;
    ctx.body = { error: "Todo cannot be empty" };
    return;
  }

  if (text.length > 140) {
    ctx.status = 400;
    ctx.body = { error: "Todo exceeds 140 characters" };
    return;
  }

  todos.push(text);

  ctx.status = 201;
  ctx.body = { message: "Todo created" };
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Todo Backend running on port ${PORT}`);
});