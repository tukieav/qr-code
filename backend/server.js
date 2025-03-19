const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/businesses', require('./routes/businessRoutes'));
app.use('/api/surveys', require('./routes/surveyRoutes'));
app.use('/api/qrcodes', require('./routes/qrCodeRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));


// Public survey route (accessible without authentication)
app.use('/survey', require('./routes/publicSurveyRoute'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});