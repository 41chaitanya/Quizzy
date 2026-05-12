import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


export default app;