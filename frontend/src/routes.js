// src/routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth and Main Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from './pages/NotFound';

// Survey Pages
import SurveyManagement from './pages/Surveys/SurveyManagement';
import CreateSurvey from './pages/Surveys/CreateSurvey';
import EditSurvey from './pages/Surveys/EditSurvey';

// QR Code Pages
import QRCodeManagement from './pages/QRCodes/QRCodeManagement';
import CreateQRCode from './pages/QRCodes/CreateQRCode';

// Feedback Pages
import FeedbackAnalysis from './pages/Feedback/FeedbackAnalysis';
import FeedbackDetails from './pages/Feedback/FeedbackDetails';

// Subscription Pages
import SubscriptionPlan from './pages/Subscription/SubscriptionPlan';

// Public Survey Pages
import SurveyForm from './pages/SurveyForm/SurveyForm';
import ThankYou from './pages/SurveyForm/ThankYou';

// Auth Check Component
import PrivateRoute from './components/common/PrivateRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Public Survey Routes */}
            <Route path="/survey/:uniqueCode" element={<SurveyForm />} />
            <Route path="/survey/thankyou" element={<ThankYou />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            {/* Survey Routes */}
            <Route path="/surveys" element={<PrivateRoute><SurveyManagement /></PrivateRoute>} />
            <Route path="/surveys/create" element={<PrivateRoute><CreateSurvey /></PrivateRoute>} />
            <Route path="/surveys/edit/:id" element={<PrivateRoute><EditSurvey /></PrivateRoute>} />

            {/* QR Code Routes */}
            <Route path="/qrcodes" element={<PrivateRoute><QRCodeManagement /></PrivateRoute>} />
            <Route path="/qrcodes/create" element={<PrivateRoute><CreateQRCode /></PrivateRoute>} />

            {/* Feedback Routes */}
            <Route path="/feedback" element={<PrivateRoute><FeedbackAnalysis /></PrivateRoute>} />
            <Route path="/feedback/:id" element={<PrivateRoute><FeedbackDetails /></PrivateRoute>} />

            {/* Subscription Routes */}
            <Route path="/subscription" element={<PrivateRoute><SubscriptionPlan /></PrivateRoute>} />

            {/* Catch-all and Redirects */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};

export default AppRoutes;