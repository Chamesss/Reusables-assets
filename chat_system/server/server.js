import express from "express";
import { Server } from "socket.io";

const app = express();
const PORT = 8080

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"]
    }
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)
})