var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// Routes
var reportRouter = require('./routes/report'),
    indexRouter = require('./routes/index'),
    verifyRouter = require('./routes/verify'),
    userRouter = require('./routes/Persons/user'),
    voluteerRouter = require('./routes/Persons/volunteer'),
    shoRouter = require('./routes/Persons/sho'),
    ioRouter = require('./routes/Persons/io'),
    spRouter = require('./routes/Persons/sp'),
    legalRouter = require('./routes/Persons/legal'),
    firRouter = require('./routes/fir'),
    analyseRouter = require('./routes/analyse');

const app = express(),
    PORT = process.env.PORT || 5000;

// App setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose setup
mongoose.connect("mongodb://localhost/vps",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then((data) => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.log("Error connecting to DB : ", err);
    })


app.use('/firs', firRouter);
app.use('/reports', reportRouter);
app.use('/verify', verifyRouter);
app.use('/analyse', analyseRouter);

// Persons Router
app.use('/user', userRouter);
app.use('/sho', shoRouter);
app.use('/sp', spRouter);
app.use('/legal', legalRouter);
app.use('/io', ioRouter);
app.use('/volunteer', voluteerRouter);

// Index Router
app.use('/', indexRouter);


app.listen(PORT, () => {
    console.log('Server listening on PORT:', PORT);
});