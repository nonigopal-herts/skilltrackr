const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, (req, res) => {
    const filename = req.body.file;
    const resumePath = path.join(__dirname, '../uploads', filename);
    const command = `python3 ../nlp-parser/recommender.py "${resumePath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).json({ error: 'Recommendation failed' });
        }

        const match = stdout.match(/Top Career Suggestions: \\[(.*?)\\]/);
        const careers = match && match[1] ? match[1].split(',').map(s => s.trim().replace(/['"]+/g, '')) : [];
        res.json({ careers });
    });
});

module.exports = router;
