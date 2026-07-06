const express = require('express');

const { ensureImage, imagePath } = require('./imageManager');

const app = express();

const PORT = process.env.PORT || 8080;

app.get('/', async (req, res) => {

    await ensureImage();

    res.send(`
    <!DOCTYPE html>

    <html>

    <head>

        <title>Todo App</title>

        <style>

            body{

                font-family: Arial;

                text-align:center;

                background:#f5f5f5;

                margin-top:40px;

            }

            img{

                width:700px;

                max-width:90%;

                border-radius:12px;

                box-shadow:0 0 20px rgba(0,0,0,.25);

            }

            h1{

                font-size:48px;

            }

            p{

                font-size:22px;

            }

        </style>

    </head>

    <body>

        <h1>TODO APP</h1>

        <img src="/image">

        <p>DevOps with Kubernetes 2026</p>

    </body>

    </html>
    `);

});

app.get('/image', async (req, res) => {

    await ensureImage();

    res.sendFile(imagePath);

});

app.listen(PORT, () => {

    console.log(`Todo App listening on ${PORT}`);

});