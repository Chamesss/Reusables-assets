mongoose = require('mongoose');
cors = require('cors');
express = require('express');
morgan = require('morgan');
helmet = require("helmet");
require("dotenv").config();

const cookieparser = require('cookie-parser'); 
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = 8080;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected !');
    })
    .catch((error) => {
        console.log('Failed to connect: ', error);
    })

app.use(cors({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    origin: ['http://localhost:8080'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(helmet());
app.use(cookieparser()); 

app.use('/user', userRoutes);

app.all("*", (req, res, next) => {
    res.status(404).json({
      status: "false ",
      message: "Page Note Found !",
    });
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});