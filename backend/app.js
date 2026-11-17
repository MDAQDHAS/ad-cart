const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Load env FIRST so DB_URL etc. are available to everything below
dotenv.config({path: path.join(__dirname, 'config', 'config.env')});

const connectDatabase = require('./config/connectDatabase');
const products = require('./routes/product');
const orders = require('./routes/order');

// A single bad request/DB error must never take the whole site down
process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err));
process.on('uncaughtException', (err) => console.error('Uncaught exception:', err));

connectDatabase();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/v1/', products);
app.use('/api/v1/', orders);

// Serve the React build whenever it exists (don't depend on NODE_ENV being set)
const buildPath = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(path.join(buildPath, 'index.html'))) {
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    console.warn('frontend/build not found - run "npm run build" first.');
}

// Final error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const port = process.env.PORT || 8002;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening to Port ${port} in ${process.env.NODE_ENV}`)
});
