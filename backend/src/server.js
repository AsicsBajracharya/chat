import express from 'express'; 
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser'
import rateLimit from "express-rate-limit";
import cors from "cors";
import {app, server} from './lib/socket.js'

dotenv.config();
// const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                // 100 requests per IP
    standardHeaders: true,   // RateLimit-* headers
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later.",
    },
});

// app.use("/", limiter);

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';



app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    connectDB();
});