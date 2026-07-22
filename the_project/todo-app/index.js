const express = require('express');
const axios = require('axios');

const { ensureImage, imagePath } = require('./imageManager');

const app = express();

const PORT = process.env.PORT;
const BACKEND_URL = process.env.TODO_BACKEND_URL;

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {

    await ensureImage();

    let todos = [];
    let backendUnavailable = req.query.broken === '1';

    try {

        const response = await axios.get(`${BACKEND_URL}/todos`);
        todos = response.data;

    } catch (err) {

        console.error("Unable to fetch todos:", err.message);
        backendUnavailable = true;

    }

    const todoList = todos
        .map(todo => `<li>${todo}</li>`)
        .join('');

    res.send(`
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>Todo App</title>

<style>

body{

    font-family: Arial, Helvetica, sans-serif;
    background:#f4f6f8;
    text-align:center;
    margin:0;
    padding:40px 0 80px 0;

}

.container{

    width:900px;
    max-width:95%;
    margin:auto;

}

h1{

    font-size:48px;
    margin-bottom:30px;

}

img{

    width:700px;
    max-width:100%;
    border-radius:12px;
    box-shadow:0 8px 20px rgba(0,0,0,.2);
    margin-bottom:35px;

}

form{

    display:flex;
    justify-content:center;
    align-items:center;
    gap:10px;
    margin-bottom:40px;

}

input{

    flex:1;
    max-width:550px;
    padding:14px;
    border:2px solid #4CAF50;
    border-radius:8px;
    font-size:16px;
    outline:none;

}

input:focus{

    box-shadow:0 0 8px rgba(76,175,80,.35);

}

button{

    padding:14px 24px;
    background:#4CAF50;
    color:white;
    border:none;
    border-radius:8px;
    font-size:16px;
    cursor:pointer;
    transition:.2s;

}

button:hover{

    background:#3d9140;
    transform:translateY(-1px);

}

#break-form{

    margin-top:40px;

}

#break-btn{

    background:#d32f2f;

}

#break-btn:hover{

    background:#a61f1f;

}

.system-failure{

    margin:0 auto 30px;
    max-width:650px;
    padding:24px;
    background:#ffebee;
    border:3px solid #d32f2f;
    border-radius:12px;
    color:#b71c1c;

}

.system-failure h2{

    margin:0 0 10px;
    font-size:32px;

}

.system-failure p{

    margin:0;
    font-size:18px;

}

h2{

    margin-top:20px;
    margin-bottom:20px;

}

.todo-container{

    width:650px;
    max-width:100%;
    margin:auto;
    background:white;
    border-radius:12px;
    box-shadow:0 6px 16px rgba(0,0,0,.12);
    padding:20px;

}

ul{

    list-style:none;
    padding:0;
    margin:0;

}

li{

    background:#fafafa;
    border-left:6px solid #4CAF50;
    border-radius:6px;
    padding:15px 18px;
    margin-bottom:12px;
    text-align:left;
    font-size:18px;
    transition:.2s;

}

li:hover{

    background:#eef8ee;
    transform:translateX(4px);

}

.footer-space{

    height:80px;

}

</style>

</head>

<body>

<div class="container">

<h1>TODO APP</h1>

${backendUnavailable ? `
<section class="system-failure" role="alert">
<h2>System Failure</h2>
<p>The todo app is currently unhealthy. Please wait for recovery.</p>
</section>
` : ''}

<img src="/image">

<form action="/todo" method="POST">

<input
type="text"
name="todo"
maxlength="140"
placeholder="Enter a new todo (max 140 characters)"
required>

<button type="submit">
Send
</button>

</form>

<h2>Todos</h2>

<div class="todo-container">

<ul>

${todoList}

</ul>

</div>

<form id="break-form" action="/break" method="POST">

<button id="break-btn">
    break the app
</button>

</form>

<div class="footer-space"></div>

</div>

</body>

</html>
`);

});

app.post('/todo', async (req, res) => {

    const todo = req.body.todo;

    if (!todo || todo.length > 140) {

        return res.redirect('/');

    }

    try {

        await axios.post(`${BACKEND_URL}/todos`, {
            text: todo
        });

    } catch (err) {

        console.error("Unable to save todo:", err.message);

    }

    res.redirect('/');

});

app.post('/break', async (req, res) => {

    try {

        await axios.post(`${BACKEND_URL}/break`);

    } catch (err) {

        console.error("Unable to break backend:", err.message);

    }

    res.redirect('/?broken=1');

});

app.get('/image', async (req, res) => {

    await ensureImage();

    res.sendFile(imagePath);

});

app.listen(PORT, () => {

    console.log(`Todo App listening on port ${PORT}`);

});
