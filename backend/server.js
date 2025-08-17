const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const resumeRoutes = require('./routes/resume');
const recommendRoutes = require('./routes/recommend');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/recommend', recommendRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
