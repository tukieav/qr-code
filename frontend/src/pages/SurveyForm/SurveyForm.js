// src/pages/SurveyForm/SurveyForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const SurveyForm = () => {
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const { uniqueCode } = useParams();
    const navigate = useNavigate();

    // API base URL (same as in services/api.js but without the auth interceptor)
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Fetch survey data
    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/survey/${uniqueCode}`);
                setSurvey(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error loading survey');
                setLoading(false);
            }
        };

        fetchSurvey();
    }, [uniqueCode, API_URL]);

    // Generate validation schema dynamically based on survey questions
    const generateValidationSchema = (survey) => {
        if (!survey || !survey.questions) return {};

        const validationFields = {};

        survey.questions.forEach((question, index) => {
            const fieldName = `responses[${index}].answer`;

            if (question.required) {
                switch (question.question_type) {
                    case 'rating':
                        validationFields[fieldName] = Yup.number()
                            .required('Rating is required')
                            .min(1, 'Please select a rating')
                            .max(5, 'Please select a rating');
                        break;
                    case 'text':
                        validationFields[fieldName] = Yup.string()
                            .required('Response is required');
                        break;
                    case 'multiple_choice':
                        validationFields[fieldName] = Yup.string()
                            .required('Please select an option');
                        break;
                    default:
                        break;
                }
            }
        });

        return Yup.object().shape(validationFields);
    };

    // Generate initial values for form
    const generateInitialValues = (survey) => {
        if (!survey || !survey.questions) return { responses: [] };

        const responses = survey.questions.map(question => ({
            question_id: question._id,
            question_text: question.question_text,
            question_type: question.question_type,
            answer: question.question_type === 'rating' ? 0 : ''
        }));

        return { responses };
    };

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true);
            setSubmitting(true);

            // Calculate average rating if there are rating questions
            const ratingResponses = values.responses.filter(
                response => response.question_type === 'rating' && response.answer > 0
            );

            const averageRating = ratingResponses.length > 0
                ? ratingResponses.reduce((sum, response) => sum + Number(response.answer), 0) / ratingResponses.length
                : null;

            // Find text comments if any
            const commentResponses = values.responses.filter(
                response => response.question_type === 'text' && response.answer.trim() !== ''
            );

            const comment = commentResponses.length > 0
                ? commentResponses[0].answer
                : '';

            // Prepare submission data
            const submissionData = {
                qrCodeId: uniqueCode,
                responses: values.responses,
                rating: averageRating,
                comment
            };

            // Submit feedback
            await axios.post(`${API_URL}/survey/${uniqueCode}/submit`, submissionData);

            // Navigate to thank you page
            navigate(`/survey/thankyou`);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit feedback');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading survey...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <div className="text-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Survey Not Found</h1>
                    <p className="text-gray-700 mb-6">The survey you're looking for doesn't exist or has been deactivated.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-6">
                    <h1 className="text-2xl font-bold text-white">{survey.title}</h1>
                    {survey.description && (
                        <p className="mt-2 text-blue-100">{survey.description}</p>
                    )}
                </div>

                <div className="p-6">
                    <Formik
                        initialValues={generateInitialValues(survey)}
                        validationSchema={generateValidationSchema(survey)}
                        onSubmit={handleSubmit}
                    >
                        {({ values, isSubmitting }) => (
                            <Form>
                                {survey.questions.map((question, index) => (
                                    <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                                        <div className="mb-3 flex items-start">
                                            <span className="font-medium text-gray-800">{question.question_text}</span>
                                            {question.required && (
                                                <span className="ml-1 text-red-500">*</span>
                                            )}
                                        </div>

                                        {/* Rating Question */}
                                        {question.question_type === 'rating' && (
                                            <div>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <label key={star} className="mr-4 cursor-pointer">
                                                            <Field
                                                                type="radio"
                                                                name={`responses[${index}].answer`}
                                                                value={star.toString()}
                                                                className="hidden"
                                                            />
                                                            <div className={`text-3xl ${
                                                                values.responses[index]?.answer >= star
                                                                    ? 'text-yellow-400'
                                                                    : 'text-gray-300'
                                                            }`}>
                                                                ★
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                                <ErrorMessage
                                                    name={`responses[${index}].answer`}
                                                    component="div"
                                                    className="text-red-500 mt-1 text-sm"
                                                />
                                            </div>
                                        )}

                                        // Continuing src/pages/SurveyForm/SurveyForm.js
                                        {/* Text Question */}
                                        {question.question_type === 'text' && (
                                            <div>
                                                <Field
                                                    as="textarea"
                                                    name={`responses[${index}].answer`}
                                                    rows="3"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter your response here..."
                                                />
                                                <ErrorMessage
                                                    name={`responses[${index}].answer`}
                                                    component="div"
                                                    className="text-red-500 mt-1 text-sm"
                                                />
                                            </div>
                                        )}

                                        {/* Multiple Choice Question */}
                                        {question.question_type === 'multiple_choice' && (
                                            <div>
                                                <div className="space-y-2">
                                                    {question.options.map((option, optionIndex) => (
                                                        <label key={optionIndex} className="flex items-start cursor-pointer">
                                                            <Field
                                                                type="radio"
                                                                name={`responses[${index}].answer`}
                                                                value={option}
                                                                className="mt-1 h-4 w-4 text-blue-600"
                                                            />
                                                            <span className="ml-2 text-gray-700">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <ErrorMessage
                                                    name={`responses[${index}].answer`}
                                                    component="div"
                                                    className="text-red-500 mt-1 text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>

                <div className="px-6 py-4 bg-gray-50 text-center text-gray-500 text-sm">
                    Your feedback is anonymous and helps improve our service.
                </div>
            </div>
        </div>
    );
};

export default SurveyForm;