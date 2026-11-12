// server.js
// Member 1: Initial Express Server Setup, Middleware & Health Check

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in Middleware for JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Root Health & Welcome Endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        system: 'LensLab Studio API',
        theme: 'Camera Rental System',
        status: 'Online',
        endpoints: {
            cameras: '/cameras',
            photographers: '/photographers',
            rentals: '/rentals (JOIN: with photographer & camera names)'
        }
    });
});

// 404 Not Found Catch-All
app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.url} - Endpoint Not Found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON syntax in request body' });
    }
    console.error('Unhandled Application Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`LensLab Studio Server running on port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`===============================================`);
});

module.exports = { app };
