import express from 'express';
const router = express.Router();

router.get('/signup', (req, res) => {
    res.status(200).send('Signup successful!!');
});

router.post('/login', (req, res) => {
    res.status(200).send('login successful');
});

router.post('/logout', (req, res) => {
    res.status(200).send('logout successful');
});

export default router;