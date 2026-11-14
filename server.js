const express = require('express');
const { initDb } = require('./database/db');

const cameraRoutes = require('./routes/cameraRoutes');
const photographerRoutes = require('./routes/photographerRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

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

app.use('/cameras', cameraRoutes);
app.use('/photographers', photographerRoutes);
app.use('/rentals', rentalRoutes);

app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.url} - Endpoint Not Found` });
});

app.use((err, req, res, next) => {
    console.error('Unhandled Application Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

async function startServer() {
    try {
        await initDb();
        console.log('SQLite Database connected and tables verified.');

        app.listen(PORT, () => {
            console.log(`===============================================`);
            console.log(`LensLab Studio Server running on port ${PORT}`);
            console.log(`URL: http://localhost:${PORT}`);
            console.log(`===============================================`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };