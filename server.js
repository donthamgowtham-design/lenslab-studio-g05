// server.js
// Member 1: Express Server Setup, Route Mounting & Middleware Architecture

const express = require('express');
const { initDb } = require('./database/db');

// Import Route Handlers
const cameraRoutes = require('./routes/cameraRoutes');
const photographerRoutes = require('./routes/photographerRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

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

// Route Mounting
app.use('/cameras', cameraRoutes);
app.use('/photographers', photographerRoutes);
app.use('/rentals', rentalRoutes);

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

// Initialize Database and Start Server
async function startServer() {
    try {
        await initDb();
        console.log('SQLite Database connected and tables verified.');

        const server = app.listen(PORT, () => {
            console.log(`===============================================`);
            console.log(`LensLab Studio Server running on port ${PORT}`);
            console.log(`URL: http://localhost:${PORT}`);
            console.log(`===============================================`);
        });

        return server;
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
