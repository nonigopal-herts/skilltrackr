const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

let profile = {};

router.put('/profile', auth, (req, res) => {
    profile[req.user.email] = req.body;
    res.json({ message: 'Profile updated' });
});

module.exports = router;
