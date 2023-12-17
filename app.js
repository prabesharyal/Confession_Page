// app.js
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
// const moment = require('moment')
const app = express();
const port = 3000;

dotenv.config();

const DBURI = process.env.DBURI
// MongoDB connection
mongoose.connect(DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Models
const Confession = require('./src/models/confession');

// Middleware
app.use(cors({ origin: ['https://prabesharyal.info.np', 'https://prabesharyal-info.web.app'] }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to parse JSON bodies

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    try {
        const confessions = await Confession.find().sort({ timestamp: -1 });
        res.render('index', { confessions, req });
    } catch (error) {
        console.error('Error retrieving confessions:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/confess', async (req, res) => {
    try {
        console.log(req.body);
        console.log('Received confession data:', req.body.content);
        console.log('Request IP Address:', req.ip);
        console.log('Request User Agent:', req.headers['user-agent']);
        // Use req.body for JSON data and req.body.content for form data
        const confession = new Confession({
            content: req.body.content,
            timestamp: req.body.timestamp,
            ipAddress: req.body.ipAddress,
            userAgent: req.body.userAgent,
        });

        await confession.save();

        // Send a JSON response indicating success
        // res.json({ message: 'Confession submitted successfully!' });
        res.redirect('/');

    } catch (error) {
        console.error('Error saving confession:', error);

        // Send a JSON response indicating an error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// API route
app.get('/api/json', async (req, res) => {
    try {
        const confessions = await Confession.find().sort({ timestamp: -1 });
        res.json({ confessions });
    } catch (error) {
        console.error('Error retrieving confessions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Server setup
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
