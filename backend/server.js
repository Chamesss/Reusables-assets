mongoose = require('mongoose');
cors = require('cors');
express = require('express');
morgan = require('morgan');
helmet = require("helmet");
const cookieparser = require('cookie-parser'); 
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = 8080;


mongoose.connect('mongodb+srv://chams:chams@base-cluster.ad8qz93.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected !');
    })
    .catch((err) => {
        console.log('Failed to connect: ', err);
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
app.use(express.json());
app.use(cookieparser()); 




app.use('/user', userRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});