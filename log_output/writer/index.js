const fs = require('fs');
const path = require('path');

const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'output.txt');

fs.mkdirSync(directory, { recursive: true });

const randomString = Math.random().toString(36).substring(2, 8);

console.log(`Started with ${randomString}`);

const writeLog = () => {

    const timestamp = new Date().toISOString();

    const line = `${timestamp}: ${randomString}`;

    fs.writeFile(filePath, line, err => {

        if (err) {

            console.error(err);

            return;

        }

        console.log(line);

    });

};

writeLog();

setInterval(writeLog, 5000);