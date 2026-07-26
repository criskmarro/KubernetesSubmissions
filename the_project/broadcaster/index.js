const http = require('http');
const { connect } = require('@nats-io/transport-node');

const NATS_URL = process.env.NATS_URL || 'nats://nats-service:4222';
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;
const TODO_STATUS_SUBJECT = 'todos.status';
const QUEUE_GROUP = 'todo-broadcasters';

const natsDecoder = new TextDecoder();
let natsConnected = false;

if (!WEBHOOK_URL) {
    throw new Error('WEBHOOK_URL must be configured');
}

function createMessage(event) {

    const action = event.type === 'todo.completed' ? 'completed' : 'created';

    return {
        user: 'todo-bot',
        message: `Todo ${action}: ${event.todo.text}`
    };

}

async function sendToWebhook(event) {

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(createMessage(event)),
        signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
        throw new Error(`Webhook responded with ${response.status}`);
    }

}

async function subscribeToTodoStatuses() {

    const connection = await connect({ servers: NATS_URL });
    natsConnected = true;

    console.log(`Connected to NATS at ${NATS_URL}`);

    connection.closed().then((err) => {
        natsConnected = false;
        console.error('NATS connection closed:', err ? err.message : 'closed');
    });

    const subscription = connection.subscribe(TODO_STATUS_SUBJECT, {
        queue: QUEUE_GROUP
    });

    console.log(`Subscribed to ${TODO_STATUS_SUBJECT} in queue group ${QUEUE_GROUP}`);

    for await (const receivedMessage of subscription) {
        try {
            const event = JSON.parse(natsDecoder.decode(receivedMessage.data));
            await sendToWebhook(event);
            console.log(`Forwarded ${event.type} for todo ${event.todo.id}`);
        } catch (err) {
            // Core NATS is at-most-once. Do not retry here: retries could duplicate chat messages.
            console.error('Unable to forward todo status:', err.message);
        }
    }

}

const healthServer = http.createServer((req, res) => {
    if (req.url === '/healthz' && natsConnected) {
        res.writeHead(200);
        res.end('OK');
        return;
    }

    res.writeHead(503);
    res.end('Unhealthy');
});

healthServer.listen(PORT, () => {
    console.log(`Broadcaster health endpoint listening on port ${PORT}`);
});

subscribeToTodoStatuses().catch(err => {
    console.error('Unable to start broadcaster:', err.message);
    process.exit(1);
});
