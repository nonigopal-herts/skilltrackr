const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: './backend/uploads',
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('resume'), (req, res) => {
    res.json({ file: req.file.filename });
});

module.exports = router;
