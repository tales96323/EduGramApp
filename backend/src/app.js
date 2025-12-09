const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files (images)
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// API Routes
app.use('/', routes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

module.exports = app;
