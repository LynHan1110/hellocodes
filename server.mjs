import express from 'express'
import path from 'node:path';
import http from 'http'
import dotenv from 'dotenv'

dotenv.config()
dotenv.configDotenv()
import { fileURLToPath } from 'node:url';
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/search', (req, res) => {
    res.sendFile(__dirname + '/search/index.html')
})
app.use('/', express.static(__dirname + '/'))
const port = 3000

const httpServer = http.createServer(app)

httpServer.listen(port, () => {
    console.log('Listening on http://localhost:3000');
})