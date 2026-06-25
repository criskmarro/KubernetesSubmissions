const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body>
          <h1>Todo App</h1>
          <p>The application is running inside Kubernetes!</p>
        </body>
      </html>
    `);
  }
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});