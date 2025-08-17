const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = []; // in-memory user store

router.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    users.push({ email, password, name });
    res.sendStatus(201);
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ email }, 'secretkey');
    res.json({ token });
});

module.exports = router;
