const mongoose = require('mongoose');

const RETRY_DELAY_MS = 15000;

// Never let a bad connection crash the server - keep retrying in background.
const connectDatabase = () => {
    const url = process.env.DB_URL;

    if (!url) {
        console.error('DB_URL is not set. Running with built-in demo product data (no database).');
        return;
    }

    mongoose.connect(url, { serverSelectionTimeoutMS: 8000 }).then((con) => {
        console.log('MongoDB connected to host: ' + con.connection.host);
    }).catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
        console.error(`Retrying in ${RETRY_DELAY_MS / 1000}s. Serving demo product data meanwhile.`);
        setTimeout(connectDatabase, RETRY_DELAY_MS);
    });
};

const isDatabaseReady = () => mongoose.connection.readyState === 1;

module.exports = connectDatabase;
module.exports.isDatabaseReady = isDatabaseReady;
