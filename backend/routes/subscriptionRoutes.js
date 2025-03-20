// routes/subscriptionRoutes.js - zaktualizowane trasy

const express = require('express');
const {
    getCurrentSubscription,
    updateSubscription,
    createCheckoutSession, // Nowa funkcja
    cancelSubscription,    // Nowa funkcja
    changePlan,           // Nowa funkcja
    getPaymentHistory,    // Nowa funkcja
    handleStripeWebhook   // Nowa funkcja
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Trasy chronione
router.use('/current', protect);
router.use('/update', protect);
router.use('/checkout', protect);
router.use('/cancel', protect);
router.use('/change-plan', protect);
router.use('/history', protect);

// Trasy
router.get('/current', getCurrentSubscription);
router.post('/update', updateSubscription);
router.post('/checkout', createCheckoutSession);
router.post('/cancel', cancelSubscription);
router.post('/change-plan', changePlan);
router.get('/history', getPaymentHistory);

// Webhook Stripe
router.post('/webhook', handleStripeWebhook);

module.exports = router;