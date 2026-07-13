const axios = require('axios');

const BACKEND_URL =
  process.env.BACKEND_URL || 'http://todo-backend-service';

async function main() {

    try {

        console.log("Getting random Wikipedia article...");

        const response = await axios.get(
            'https://en.wikipedia.org/wiki/Special:Random',
            {
                maxRedirects: 0,
                validateStatus: status => status === 302,
                headers: {
                    'User-Agent': 'DevOpsWithKubernetes-TodoApp/1.0'
                }
            }
        );

        const article = response.headers.location;

        const todo = `Read ${article}`;

        console.log(`Creating todo: ${todo}`);

        await axios.post(`${BACKEND_URL}/todos`, {
            text: todo
        });

        console.log("Todo created successfully");

    } catch (err) {

        console.error(err.message);

        process.exit(1);

    }

}

main();