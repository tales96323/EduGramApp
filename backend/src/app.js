const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static files (images, pdfs and supplementary attachments)
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/pdfs', express.static(path.join(__dirname, '../public/pdfs')));
app.use('/files', express.static(path.join(__dirname, '../public/files')));

// API Routes
app.use('/', routes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

module.exports = app;
