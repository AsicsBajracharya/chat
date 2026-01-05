import express from 'express'; 
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});