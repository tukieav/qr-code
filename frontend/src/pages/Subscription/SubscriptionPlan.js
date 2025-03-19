// src/pages/Subscription/SubscriptionPlan.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/solid';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const SubscriptionPlan = () => {
    const [subscription, setSubscription] = useState(null);
    const [usage, setUsage] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { showNotification } = useContext(UIContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true);
                const response = await api.get('/subscription/current');
                setSubscription(response.data.data.subscription);
                setUsage(response.data.data.usage);
                setSelectedPlan(response.data.data.subscription.subscription_plan);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching subscription data');
                setLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    const handleUpdateSubscription = async () => {
        try {
            setUpdating(true);

            // Don't make API call if plan didn't change
            if (selectedPlan === subscription.subscription_plan) {
                showNotification('You are already on this plan.', 'info');
                setUpdating(false);
                return;
            }

            const response = await api.post('/subscription/update', { plan: selectedPlan });

            // Update local subscription data
            setSubscription(response.data.data);

            showNotification(`Successfully updated to ${selectedPlan} plan!`, 'success');

            // In a real app, this would redirect to payment for paid plans
            if (selectedPlan !== 'free') {
                // Simulate payment success for demo
                setTimeout(() => {
                    showNotification('Payment processed successfully!', 'success');
                }, 1000);
            }

            setUpdating(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update subscription');
            showNotification('Failed to update subscription.', 'error');
            setUpdating(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading subscription data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title="Subscription Plans" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Subscription Plans</h1>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Current Subscription */}
                    {subscription && (
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Subscription</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Plan:</span> {' '}
                                        <span className="capitalize">{subscription.subscription_plan}</span>
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Status:</span> {' '}
                                        <span className={`capitalize ${
                                            subscription.subscription_status === 'active'
                                                ? 'text-green-600'
                                                : subscription.subscription_status === 'trial'
                                                    ? 'text-blue-600'
                                                    : 'text-red-600'
                                        }`}>
                      {subscription.subscription_status}
                    </span>
                                    </p>

                                    {subscription.subscription_status === 'trial' && (
                                        <p className="text-gray-600 mb-2">
                                            <span className="font-medium">Trial Ends:</span> {' '}
                                            {formatDate(subscription.trial_ends_at)}
                                        </p>
                                    )}

                                    {subscription.subscription_status === 'active' && subscription.subscription_plan !== 'free' && (
                                        <>
                                            <p className="text-gray-600 mb-2">
                                                <span className="font-medium">Started:</span> {' '}
                                                {formatDate(subscription.subscription_starts_at)}
                                            </p>
                                            <p className="text-gray-600 mb-2">
                                                <span className="font-medium">Renews:</span> {' '}
                                                {formatDate(subscription.subscription_ends_at)}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Usage Stats */}
                                {usage && (
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Usage</h3>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-600">Surveys</span>
                                                    <span className="text-gray-600">
                            {usage.surveys.used} / {usage.surveys.limit === -1 ? 'Unlimited' : usage.surveys.limit}
                          </span>
                                                </div>

                                                {usage.surveys.limit !== -1 && (
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${Math.min((usage.surveys.used / usage.surveys.limit) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-600">QR Codes</span>
                                                    <span className="text-gray-600">
                            {usage.qrCodes.used} / {usage.qrCodes.limit === -1 ? 'Unlimited' : usage.qrCodes.limit}
                          </span>
                                                </div>

                                                {usage.qrCodes.limit !== -1 && (
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${Math.min((usage.qrCodes.used / usage.qrCodes.limit) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-600">Responses (This Month)</span>
                                                    <span className="text-gray-600">
                            {usage.responsesThisMonth.used} / {usage.responsesThisMonth.limit === -1 ? 'Unlimited' : usage.responsesThisMonth.limit}
                          </span>
                                                </div>

                                                {usage.responsesThisMonth.limit !== -1 && (
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${
                                                                (usage.responsesThisMonth.used / usage.responsesThisMonth.limit) > 0.9
                                                                    ? 'bg-red-500'
                                                                    : (usage.responsesThisMonth.used / usage.responsesThisMonth.limit) > 0.7
                                                                        ? 'bg-yellow-500'
                                                                        : 'bg-blue-600'
                                                            }`}
                                                            style={{ width: `${Math.min((usage.responsesThisMonth.used / usage.responsesThisMonth.limit) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Subscription Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Free Plan */}
                        <div className={`bg-white p-6 rounded-lg shadow border-2 ${
                            selectedPlan === 'free' ? 'border-blue-500' : 'border-transparent'
                        }`}>
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Free</h3>
                                <p className="text-4xl font-bold mt-2">$0</p>
                                <p className="text-gray-500">per month</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>1 Active Survey</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>1 QR Code</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>100 Responses per Month</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Basic Analytics</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => setSelectedPlan('free')}
                                className={`w-full py-2 rounded-lg font-medium ${
                                    selectedPlan === 'free'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                {selectedPlan === 'free' ? 'Selected' : 'Select'}
                            </button>
                        </div>

                        {/* Basic Plan */}
                        <div className={`bg-white p-6 rounded-lg shadow border-2 ${
                            selectedPlan === 'basic' ? 'border-blue-500' : 'border-transparent'
                        }`}>
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Basic</h3>
                                <p className="text-4xl font-bold mt-2">$49</p>
                                <p className="text-gray-500">per month</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>5 Active Surveys</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>10 QR Codes</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>1,000 Responses per Month</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Advanced Analytics</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Export Data (CSV)</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => setSelectedPlan('basic')}
                                className={`w-full py-2 rounded-lg font-medium ${
                                    selectedPlan === 'basic'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                {selectedPlan === 'basic' ? 'Selected' : 'Select'}
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className={`bg-white p-6 rounded-lg shadow border-2 ${
                            selectedPlan === 'pro' ? 'border-blue-500' : 'border-transparent'
                        }`}>
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Pro</h3>
                                <p className="text-4xl font-bold mt-2">$99</p>
                                <p className="text-gray-500">per month</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Unlimited Surveys</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Unlimited QR Codes</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Unlimited Responses</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Premium Analytics</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Priority Support</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Custom Branding</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => setSelectedPlan('pro')}
                                className={`w-full py-2 rounded-lg font-medium ${
                                    selectedPlan === 'pro'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                {selectedPlan === 'pro' ? 'Selected' : 'Select'}
                            </button>
                        </div>
                    </div>

                    {/* Update Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleUpdateSubscription}
                            disabled={updating || selectedPlan === subscription?.subscription_plan}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {updating ? 'Updating...' : 'Update Subscription'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SubscriptionPlan;