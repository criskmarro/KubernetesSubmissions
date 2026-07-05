const fs = require('fs');
const path = require('path');

const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'output.txt');

const randomString = Math.random().toString(36).substring(2, 8);

fs.mkdirSync(directory, { recursive: true });

console.log(`Started with ${randomString}`);

const writeLog = () => {
  const timestamp = new Date().toISOString();
  const line = `${timestamp}: ${randomString}\n`;

  fs.appendFile(filePath, line, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(line.trim());
  });
};

writeLog();
setInterval(writeLog, 5000);