import express from 'express';
import { connectDB } from './config/mongodb';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import './config/passport';
import authRouter from './routes/authRoute';
import userRouter from './routes/userRoute';
import adminRouter from './routes/adminRoute';
dotenv.config();

const app = express();

const PORT = process.env.PORT;

connectDB();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(passport.initialize());

// api endpoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req,res) => {
    res.send('API is working.........')
})


app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})