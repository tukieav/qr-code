// src/pages/QRCodes/CreateQRCode.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { QRCodeSVG } from 'qrcode.react';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

// Validation schema
const QRCodeSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .max(50, 'Name cannot be longer than 50 characters'),
    survey_id: Yup.string()
        .required('Survey selection is required')
});

const CreateQRCode = () => {
    const [surveys, setSurveys] = useState([]);
    const [qrCodeData, setQRCodeData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { showNotification } = useContext(UIContext);
    const navigate = useNavigate();

    // Fetch available surveys
    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                setLoading(true);
                const response = await api.get('/surveys');

                // Filter active surveys only
                const activeSurveys = response.data.data.filter(survey => survey.is_active);

                setSurveys(activeSurveys);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching surveys');
                setLoading(false);
            }
        };

        fetchSurveys();
    }, []);

    // Initial values for the form
    const initialValues = {
        name: '',
        survey_id: ''
    };

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setIsGenerating(true);

            // Generate QR code
            const response = await api.post('/qrcodes', values);

            setQRCodeData(response.data.data);

            // Show success notification
            showNotification('QR code generated successfully!', 'success');
        } catch (error) {
            showNotification(
                error.response?.data?.message || 'Failed to generate QR code',
                'error'
            );
        } finally {
            setIsGenerating(false);
            setSubmitting(false);
        }
    };

    // Handle download QR code
    const handleDownload = () => {
        if (!qrCodeData) return;

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = qrCodeData.qrCodeImage;
        link.download = `${qrCodeData.name.replace(/\s+/g, '_')}_QRCode.png`;

        // Append to body, click and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading surveys...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title="Create QR Code" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Generate New QR Code</h1>

                            {/* Error message */}
                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                                    <p>{error}</p>
                                </div>
                            )}

                            {!qrCodeData ? (
                                // QR Code Generation Form
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={QRCodeSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            {/* QR Code Name */}
                                            <div className="mb-6">
                                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                                    QR Code Name*
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter a name for this QR code"
                                                />
                                                <ErrorMessage name="name" component="div" className="text-red-500 mt-1" />
                                            </div>

                                            {/* Survey Selection */}
                                            <div className="mb-6">
                                                <label htmlFor="survey_id" className="block text-gray-700 font-medium mb-2">
                                                    Select Survey*
                                                </label>

                                                {surveys.length > 0 ? (
                                                    <Field
                                                        as="select"
                                                        name="survey_id"
                                                        id="survey_id"
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Select a survey</option>
                                                        {surveys.map(survey => (
                                                            <option key={survey._id} value={survey._id}>
                                                                {survey.title}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                ) : (
                                                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                                                        <p>No active surveys found. Please create a survey first.</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate('/surveys/create')}
                                                            className="mt-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            Create a survey
                                                        </button>
                                                    </div>
                                                )}

                                                <ErrorMessage name="survey_id" component="div" className="text-red-500 mt-1" />
                                            </div>

                                            {/* Submission Buttons */}
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate('/qrcodes')}
                                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting || surveys.length === 0}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    {isGenerating ? 'Generating...' : 'Generate QR Code'}
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            ) : (
                                // QR Code Result Display
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your QR Code is Ready!</h2>

                                    <div className="my-6 flex justify-center">
                                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                                            <QRCodeSVG
                                                value={qrCodeData.surveyUrl}
                                                size={200}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Details</h3>
                                        <p className="text-gray-600 mb-1"><strong>Name:</strong> {qrCodeData.name}</p>
                                        <p className="text-gray-600 mb-3"><strong>Survey:</strong> {qrCodeData.survey_id.title}</p>

                                        <div className="bg-gray-100 p-3 rounded text-gray-800 mb-4">
                                            <p className="font-medium">Survey URL:</p>
                                            <p className="text-sm break-all">{qrCodeData.surveyUrl}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center space-x-4">
                                        <button
                                            onClick={handleDownload}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Download QR Code
                                        </button>

                                        <button
                                            onClick={() => navigate('/qrcodes')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            View All QR Codes
                                        </button>

                                        <button
                                            onClick={() => setQRCodeData(null)}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                        >
                                            Generate Another
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreateQRCode;