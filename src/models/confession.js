// src/models/confession.js
const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
    content: String,
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
});

const Confession = mongoose.model('publicconfessions', confessionSchema);

module.exports = Confession;
