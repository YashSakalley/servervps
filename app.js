var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// Routes
var firRouter = require('./routes/fir'),
    indexRouter = require('./routes/index'),
    verifyRouter = require('./routes/verify'),
    userRouter = require('./routes/user'),
    shoRouter = require('./routes/sho');

const app = express(),
    PORT = process.env.PORT || 5000;

// App setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose setup
mongoose.connect("mongodb://localhost/vps", { useNewUrlParser: true, useUnifiedTopology: true })
    .then((data) => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.log("Error connecting to DB : ", err);
    })


app.use('/firs', firRouter);
app.use('/verify', verifyRouter);
app.use('/user', userRouter);
app.use('/sho', shoRouter);

app.use('/', indexRouter);


app.listen(PORT, () => {
    console.log('Server listening on PORT:', PORT);
});