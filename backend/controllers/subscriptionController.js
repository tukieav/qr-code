// controllers/subscriptionController.js
const Business = require('../models/Business');
const QRCode = require('../models/QRCode');
const Survey = require('../models/Survey');
const Feedback = require('../models/Feedback');
const Payment = require('../models/Payment'); // Nowy model do utworzenia
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const config = require('../config');

// Get current subscription
exports.getCurrentSubscription = async (req, res, next) => {
    try {
        const business = await Business.findById(req.business._id).select(
            'subscription_plan subscription_status trial_ends_at subscription_starts_at subscription_ends_at usage_limits'
        );

        // Get usage statistics
        const surveysCount = await Survey.countDocuments({ business_id: req.business._id });
        const qrCodesCount = await QRCode.countDocuments({ business_id: req.business._id });

        // Calculate responses this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const responsesThisMonth = await Feedback.countDocuments({
            business_id: req.business._id,
            submission_date: { $gte: startOfMonth }
        });

        res.status(200).json({
            success: true,
            data: {
                subscription: business,
                usage: {
                    surveys: {
                        used: surveysCount,
                        limit: business.usage_limits.max_surveys
                    },
                    qrCodes: {
                        used: qrCodesCount,
                        limit: business.usage_limits.max_qr_codes
                    },
                    responsesThisMonth: {
                        used: responsesThisMonth,
                        limit: business.usage_limits.max_responses_per_month
                    }
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update subscription (simulate payment for now)
exports.updateSubscription = async (req, res, next) => {
    try {
        const { plan } = req.body;

        if (!['free', 'basic', 'pro'].includes(plan)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscription plan'
            });
        }

        // Set plan limits based on selected plan
        let usage_limits = {};

        switch (plan) {
            case 'free':
                usage_limits = {
                    max_surveys: 1,
                    max_qr_codes: 1,
                    max_responses_per_month: 100
                };
                break;
            case 'basic':
                usage_limits = {
                    max_surveys: 5,
                    max_qr_codes: 10,
                    max_responses_per_month: 1000
                };
                break;
            case 'pro':
                usage_limits = {
                    max_surveys: -1, // unlimited
                    max_qr_codes: -1, // unlimited
                    max_responses_per_month: -1 // unlimited
                };
                break;
        }

        // Set subscription dates
        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        // In a real app, you would process payment here
        // For now, we'll simulate successful payment for non-free plans

        // Update business subscription
        const business = await Business.findByIdAndUpdate(
            req.business._id,
            {
                subscription_plan: plan,
                subscription_status: plan === 'free' ? 'active' : 'active',
                subscription_starts_at: now,
                subscription_ends_at: plan === 'free' ? null : oneMonthLater,
                usage_limits: usage_limits,
                payment_method: plan === 'free' ? 'none' : 'card'
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: business
        });
    } catch (error) {
        next(error);
    }
};

// Nowa funkcja - inicjowanie płatności Stripe
exports.createCheckoutSession = async (req, res, next) => {
    try {
        const { plan } = req.body;

        if (!['basic', 'pro'].includes(plan)) {
            return res.status(400).json({
                success: false,
                message: 'Nieprawidłowy plan subskrypcji'
            });
        }

        const business = await Business.findById(req.business._id);

        // Przygotuj dane cenowe
        const priceData = {
            'basic': {
                amount: 4900, // 49.00 PLN w groszach
                interval: 'month',
                name: 'Plan Podstawowy'
            },
            'pro': {
                amount: 9900, // 99.00 PLN w groszach
                interval: 'month',
                name: 'Plan Pro'
            }
        };

        // Utwórz sesję płatności Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'pln',
                        product_data: {
                            name: priceData[plan].name,
                            description: `QR Opinion - ${priceData[plan].name} (Miesięczna subskrypcja)`,
                        },
                        unit_amount: priceData[plan].amount,
                        recurring: {
                            interval: priceData[plan].interval,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${config.frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.frontendUrl}/subscription/cancel`,
            customer_email: business.contact_email,
            client_reference_id: business._id.toString(),
            metadata: {
                businessId: business._id.toString(),
                plan: plan
            }
        });

        // Zapisz informacje o sesji płatności
        await Payment.create({
            business_id: business._id,
            checkout_session_id: session.id,
            plan: plan,
            status: 'pending',
            amount: priceData[plan].amount,
            currency: 'pln'
        });

        res.status(200).json({
            success: true,
            sessionId: session.id,
            url: session.url
        });
    } catch (error) {
        console.error('Błąd tworzenia sesji płatności:', error);
        next(error);
    }
};

// Obsługa webhooków Stripe
exports.handleStripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Błąd weryfikacji podpisu webhook: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Obsługa różnych typów zdarzeń
    switch (event.type) {
        case 'checkout.session.completed':
            await handleCheckoutSessionCompleted(event.data.object);
            break;
        case 'invoice.paid':
            await handleInvoicePaid(event.data.object);
            break;
        case 'invoice.payment_failed':
            await handleInvoicePaymentFailed(event.data.object);
            break;
        case 'customer.subscription.deleted':
            await handleSubscriptionCanceled(event.data.object);
            break;
        default:
            console.log(`Nieobsługiwane zdarzenie Stripe: ${event.type}`);
    }

    res.status(200).json({ received: true });
};

// Funkcja pomocnicza - obsługa zakończonej sesji płatności
const handleCheckoutSessionCompleted = async (session) => {
    try {
        const businessId = session.metadata.businessId;
        const plan = session.metadata.plan;

        // Aktualizacja rekordu płatności
        await Payment.findOneAndUpdate(
            { checkout_session_id: session.id },
            {
                status: 'completed',
                stripe_subscription_id: session.subscription,
                stripe_customer_id: session.customer
            }
        );

        // Ustawienie limitów dla wybranego planu
        let usage_limits = {};
        switch (plan) {
            case 'basic':
                usage_limits = {
                    max_surveys: 5,
                    max_qr_codes: 10,
                    max_responses_per_month: 1000
                };
                break;
            case 'pro':
                usage_limits = {
                    max_surveys: -1, // unlimited
                    max_qr_codes: -1, // unlimited
                    max_responses_per_month: -1 // unlimited
                };
                break;
        }

        // Aktualizacja rekordu firmy
        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        await Business.findByIdAndUpdate(
            businessId,
            {
                subscription_plan: plan,
                subscription_status: 'active',
                subscription_starts_at: now,
                subscription_ends_at: oneMonthLater,
                usage_limits: usage_limits,
                payment_method: 'card',
                stripe_customer_id: session.customer,
                stripe_subscription_id: session.subscription
            }
        );

        console.log(`Subskrypcja zaktualizowana dla firmy ${businessId} do planu ${plan}`);
    } catch (error) {
        console.error('Błąd przetwarzania sesji płatności:', error);
    }
};

// Funkcja pomocnicza - obsługa opłaconej faktury (przedłużenie subskrypcji)
const handleInvoicePaid = async (invoice) => {
    try {
        const stripeCustomerId = invoice.customer;

        // Znajdź firmę po id klienta Stripe
        const business = await Business.findOne({ stripe_customer_id: stripeCustomerId });

        if (!business) {
            console.error(`Nie znaleziono firmy dla klienta Stripe: ${stripeCustomerId}`);
            return;
        }

        // Przedłuż subskrypcję o miesiąc
        const newEndDate = new Date(business.subscription_ends_at);
        newEndDate.setMonth(newEndDate.getMonth() + 1);

        await Business.findByIdAndUpdate(
            business._id,
            {
                subscription_status: 'active',
                subscription_ends_at: newEndDate
            }
        );

        // Zapisz informację o płatności
        await Payment.create({
            business_id: business._id,
            stripe_invoice_id: invoice.id,
            stripe_subscription_id: invoice.subscription,
            stripe_customer_id: invoice.customer,
            plan: business.subscription_plan,
            status: 'completed',
            amount: invoice.amount_paid,
            currency: invoice.currency,
            payment_date: new Date()
        });

        console.log(`Subskrypcja przedłużona dla firmy ${business._id}`);
    } catch (error) {
        console.error('Błąd przetwarzania faktury:', error);
    }
};

// Funkcja pomocnicza - obsługa nieudanej płatności faktury
const handleInvoicePaymentFailed = async (invoice) => {
    try {
        const stripeCustomerId = invoice.customer;

        // Znajdź firmę po id klienta Stripe
        const business = await Business.findOne({ stripe_customer_id: stripeCustomerId });

        if (!business) {
            console.error(`Nie znaleziono firmy dla klienta Stripe: ${stripeCustomerId}`);
            return;
        }

        // Zmień status subskrypcji
        await Business.findByIdAndUpdate(
            business._id,
            {
                subscription_status: 'payment_failed'
            }
        );

        // Zapisz informację o nieudanej płatności
        await Payment.create({
            business_id: business._id,
            stripe_invoice_id: invoice.id,
            stripe_subscription_id: invoice.subscription,
            stripe_customer_id: invoice.customer,
            plan: business.subscription_plan,
            status: 'failed',
            amount: invoice.amount_due,
            currency: invoice.currency,
            payment_date: new Date(),
            failure_message: invoice.last_payment_error?.message || 'Płatność nie powiodła się'
        });

        console.log(`Płatność nie powiodła się dla firmy ${business._id}`);

        // Tutaj można dodać wysłanie maila z informacją o nieudanej płatności
    } catch (error) {
        console.error('Błąd przetwarzania nieudanej faktury:', error);
    }
};

// Funkcja pomocnicza - obsługa anulowanej subskrypcji
const handleSubscriptionCanceled = async (subscription) => {
    try {
        const stripeCustomerId = subscription.customer;

        // Znajdź firmę po id klienta Stripe
        const business = await Business.findOne({ stripe_customer_id: stripeCustomerId });

        if (!business) {
            console.error(`Nie znaleziono firmy dla klienta Stripe: ${stripeCustomerId}`);
            return;
        }

        // Aktualizuj status subskrypcji
        await Business.findByIdAndUpdate(
            business._id,
            {
                subscription_status: 'canceled'
            }
        );

        console.log(`Subskrypcja anulowana dla firmy ${business._id}`);
    } catch (error) {
        console.error('Błąd przetwarzania anulowanej subskrypcji:', error);
    }
};

// Anulowanie subskrypcji przez użytkownika
exports.cancelSubscription = async (req, res, next) => {
    try {
        const business = await Business.findById(req.business._id);

        if (!business.stripe_subscription_id) {
            return res.status(400).json({
                success: false,
                message: 'Nie znaleziono aktywnej subskrypcji'
            });
        }

        // Anuluj subskrypcję w Stripe
        await stripe.subscriptions.del(business.stripe_subscription_id);

        // Aktualizuj status w bazie danych
        await Business.findByIdAndUpdate(
            req.business._id,
            {
                subscription_status: 'canceled'
            }
        );

        res.status(200).json({
            success: true,
            message: 'Subskrypcja została anulowana'
        });
    } catch (error) {
        next(error);
    }
};

// Zmiana planu subskrypcji
exports.changePlan = async (req, res, next) => {
    try {
        const { plan } = req.body;

        if (!['basic', 'pro'].includes(plan)) {
            return res.status(400).json({
                success: false,
                message: 'Nieprawidłowy plan subskrypcji'
            });
        }

        const business = await Business.findById(req.business._id);

        if (!business.stripe_subscription_id) {
            return res.status(400).json({
                success: false,
                message: 'Nie znaleziono aktywnej subskrypcji do zmiany'
            });
        }

        // Pobierz identyfikator produktu dla nowego planu
        let priceId;
        if (plan === 'basic') {
            priceId = process.env.STRIPE_BASIC_PRICE_ID;
        } else {
            priceId = process.env.STRIPE_PRO_PRICE_ID;
        }

        // Zaktualizuj subskrypcję w Stripe
        const subscription = await stripe.subscriptions.retrieve(business.stripe_subscription_id);

        await stripe.subscriptions.update(business.stripe_subscription_id, {
            items: [
                {
                    id: subscription.items.data[0].id,
                    price: priceId,
                },
            ],
        });

        // Ustawienie limitów dla wybranego planu
        let usage_limits = {};
        if (plan === 'basic') {
            usage_limits = {
                max_surveys: 5,
                max_qr_codes: 10,
                max_responses_per_month: 1000
            };
        } else {
            usage_limits = {
                max_surveys: -1, // unlimited
                max_qr_codes: -1, // unlimited
                max_responses_per_month: -1 // unlimited
            };
        }

        // Aktualizacja rekordu firmy
        await Business.findByIdAndUpdate(
            req.business._id,
            {
                subscription_plan: plan,
                usage_limits: usage_limits
            }
        );

        res.status(200).json({
            success: true,
            message: `Plan subskrypcji zmieniony na ${plan}`,
            data: {
                plan,
                usage_limits
            }
        });
    } catch (error) {
        next(error);
    }
};

// Pobieranie historii płatności
exports.getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.find({ business_id: req.business._id })
            .sort({ payment_date: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};