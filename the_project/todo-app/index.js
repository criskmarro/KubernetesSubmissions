const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`<h1>Server started in port ${port}</h1>`);
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});