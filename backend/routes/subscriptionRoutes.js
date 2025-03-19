// routes/subscriptionRoutes.js
const express = require('express');
const {
    getCurrentSubscription,
    updateSubscription
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/current', getCurrentSubscription);
router.post('/update', updateSubscription);

module.exports = router;