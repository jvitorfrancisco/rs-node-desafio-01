import http from 'node:http'
import { json } from './middlewares/json.js';
import { router } from './middlewares/router.js';

const server = new http.createServer(async (req, res) => {
    await json(req, res)

    router(req, res)
});

server.listen(3333)