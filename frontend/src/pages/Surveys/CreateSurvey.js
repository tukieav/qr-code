// src/pages/Surveys/CreateSurvey.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

// Validation schema
const SurveySchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .max(100, 'Title cannot be longer than 100 characters'),
    description: Yup.string()
        .max(500, 'Description cannot be longer than 500 characters'),
    questions: Yup.array().of(
        Yup.object().shape({
            question_text: Yup.string()
                .required('Question text is required')
                .max(200, 'Question text cannot be longer than 200 characters'),
            question_type: Yup.string()
                .required('Question type is required')
                .oneOf(['rating', 'text', 'multiple_choice'], 'Invalid question type'),
            // Continuing src/pages/Surveys/CreateSurvey.js
            options: Yup.array().when('question_type', {
                is: 'multiple_choice',
                then: Yup.array()
                    .of(Yup.string().required('Option text is required'))
                    .min(2, 'At least 2 options are required')
                    .required('Options are required for multiple choice questions'),
                otherwise: Yup.array()
            }),
            required: Yup.boolean()
        })
    ).min(1, 'At least one question is required')
});

const CreateSurvey = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const { showNotification } = useContext(UIContext);
    const navigate = useNavigate();

    // Initial values for the form
    const initialValues = {
        title: '',
        description: '',
        questions: [
            {
                question_text: '',
                question_type: 'rating',
                options: [],
                required: true
            }
        ],
        is_active: true
    };

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setIsSubmitting(true);

            // Submit survey to the API
            const response = await api.post('/surveys', values);

            // Show success notification
            showNotification('Survey created successfully!', 'success');

            // Navigate to survey management
            navigate('/surveys');
        } catch (error) {
            showNotification(
                error.response?.data?.message || 'Failed to create survey',
                'error'
            );
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title="Create Survey" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create New Survey</h1>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={SurveySchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                                    <Form>
                                        {/* Survey Title */}
                                        <div className="mb-6">
                                            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                                                Survey Title*
                                            </label>
                                            <Field
                                                type="text"
                                                name="title"
                                                id="title"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter survey title"
                                            />
                                            <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
                                        </div>

                                        {/* Survey Description */}
                                        <div className="mb-6">
                                            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                                                Description (Optional)
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                id="description"
                                                rows="3"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter survey description"
                                            />
                                            <ErrorMessage name="description" component="div" className="text-red-500 mt-1" />
                                        </div>

                                        {/* Questions Section */}
                                        <div className="mb-6">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Questions*
                                            </label>

                                            <FieldArray name="questions">
                                                {({ remove, push }) => (
                                                    <div>
                                                        {values.questions.map((question, index) => (
                                                            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                                                <div className="flex justify-between mb-3">
                                                                    <h3 className="text-lg font-medium">Question {index + 1}</h3>

                                                                    {values.questions.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => remove(index)}
                                                                            className="text-red-500 hover:text-red-700"
                                                                        >
                                                                            <TrashIcon className="h-5 w-5" />
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {/* Question Text */}
                                                                <div className="mb-3">
                                                                    <label htmlFor={`questions.${index}.question_text`} className="block text-gray-700 mb-1">
                                                                        Question Text*
                                                                    </label>
                                                                    <Field
                                                                        type="text"
                                                                        name={`questions.${index}.question_text`}
                                                                        id={`questions.${index}.question_text`}
                                                                        className="w-full px-3 py-2 border rounded-lg"
                                                                        placeholder="Enter your question"
                                                                    />
                                                                    <ErrorMessage name={`questions.${index}.question_text`} component="div" className="text-red-500 mt-1" />
                                                                </div>

                                                                {/* Question Type */}
                                                                <div className="mb-3">
                                                                    <label htmlFor={`questions.${index}.question_type`} className="block text-gray-700 mb-1">
                                                                        Question Type*
                                                                    </label>
                                                                    <Field
                                                                        as="select"
                                                                        name={`questions.${index}.question_type`}
                                                                        id={`questions.${index}.question_type`}
                                                                        className="w-full px-3 py-2 border rounded-lg"
                                                                    >
                                                                        <option value="rating">Rating (1-5 Stars)</option>
                                                                        <option value="text">Text (Open Comment)</option>
                                                                        <option value="multiple_choice">Multiple Choice</option>
                                                                    </Field>
                                                                    <ErrorMessage name={`questions.${index}.question_type`} component="div" className="text-red-500 mt-1" />
                                                                </div>

                                                                {/* Options for Multiple Choice */}
                                                                {values.questions[index].question_type === 'multiple_choice' && (
                                                                    <div className="mb-3">
                                                                        <label className="block text-gray-700 mb-1">
                                                                            Options*
                                                                        </label>

                                                                        <FieldArray name={`questions.${index}.options`}>
                                                                            {({ remove: removeOption, push: pushOption }) => (
                                                                                <div>
                                                                                    {values.questions[index].options.map((option, optionIndex) => (
                                                                                        <div key={optionIndex} className="flex items-center mb-2">
                                                                                            <Field
                                                                                                type="text"
                                                                                                name={`questions.${index}.options.${optionIndex}`}
                                                                                                className="flex-1 px-3 py-2 border rounded-lg"
                                                                                                placeholder={`Option ${optionIndex + 1}`}
                                                                                            />

                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => removeOption(optionIndex)}
                                                                                                className="ml-2 text-red-500 hover:text-red-700"
                                                                                            >
                                                                                                <TrashIcon className="h-5 w-5" />
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}

                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => pushOption('')}
                                                                                        className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                                                                                    >
                                                                                        <PlusIcon className="h-4 w-4 mr-1" />
                                                                                        Add Option
                                                                                    </button>

                                                                                    <ErrorMessage name={`questions.${index}.options`} component="div" className="text-red-500 mt-1" />
                                                                                </div>
                                                                            )}
                                                                        </FieldArray>
                                                                    </div>
                                                                )}

                                                                {/* Required Toggle */}
                                                                <div className="flex items-center">
                                                                    <Field
                                                                        type="checkbox"
                                                                        name={`questions.${index}.required`}
                                                                        id={`questions.${index}.required`}
                                                                        className="h-4 w-4 text-blue-600 rounded"
                                                                    />
                                                                    <label htmlFor={`questions.${index}.required`} className="ml-2 block text-gray-700">
                                                                        Required question
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <button
                                                            type="button"
                                                            onClick={() => push({
                                                                question_text: '',
                                                                question_type: 'rating',
                                                                options: [],
                                                                required: true
                                                            })}
                                                            className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                                                        >
                                                            <PlusIcon className="h-5 w-5 mr-1" />
                                                            Add Question
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            <ErrorMessage name="questions" component="div" className="text-red-500 mt-1" />
                                        </div>

                                        {/* Active Status */}
                                        <div className="mb-6 flex items-center">
                                            <Field
                                                type="checkbox"
                                                name="is_active"
                                                id="is_active"
                                                className="h-4 w-4 text-blue-600 rounded"
                                            />
                                            <label htmlFor="is_active" className="ml-2 block text-gray-700">
                                                Make survey active immediately
                                            </label>
                                        </div>

                                        {/* Submission Buttons */}
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => navigate('/surveys')}
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Creating...' : 'Create Survey'}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreateSurvey;