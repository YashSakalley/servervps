import express, { json, urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config/db_config';

// Routes
import reportRouter from './routes/report';
import indexRouter from './routes/index';
import verifyRouter from './routes/verify';
import userRouter from './routes/Persons/user';
import voluteerRouter from './routes/Persons/volunteer';
import shoRouter from './routes/Persons/sho';
import ioRouter from './routes/Persons/io';
import spRouter from './routes/Persons/sp';
import legalRouter from './routes/Persons/legal';
import firRouter from './routes/fir';
import analyseRouter from './routes/analyse';

const app = express();
const PORT = process.env.PORT || 5000;
const { mongoURL } = config;

// App setup
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Mongoose setup
const DEV_URI = "mongodb://localhost/vps"
console.log('uri', DEV_URI)
mongoose.connect(DEV_URI,
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