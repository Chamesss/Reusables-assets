const mongoose = require('mongoose');
const cors = require('cors');
const http = require("http");
const express = require('express');
const morgan = require('morgan');
const helmet = require("helmet");
require("dotenv").config();

const cookieparser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const initializeSocket = require("./socket");
const app = express();
const port = 8080;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected !');
    })
    .catch((error) => {
        console.log('Failed to connect: ', error);
    })

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(morgan('combined'));
app.use(helmet());
app.use(cookieparser());

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

app.all("*", (req, res, next) => {
    res.status(404).json({
        status: "false ",
        message: "Page Note Found !",
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});