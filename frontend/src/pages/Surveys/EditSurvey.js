import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

// Schemat walidacji
const SurveySchema = Yup.object().shape({
    title: Yup.string()
        .required('Tytuł jest wymagany')
        .max(100, 'Tytuł nie może być dłuższy niż 100 znaków'),
    description: Yup.string()
        .max(500, 'Opis nie może być dłuższy niż 500 znaków'),
    questions: Yup.array().of(
        Yup.object().shape({
            question_text: Yup.string()
                .required('Tekst pytania jest wymagany')
                .max(200, 'Tekst pytania nie może być dłuższy niż 200 znaków'),
            question_type: Yup.string()
                .required('Typ pytania jest wymagany')
                .oneOf(['rating', 'text', 'multiple_choice'], 'Nieprawidłowy typ pytania'),
            options: Yup.array().when('question_type', {
                is: 'multiple_choice',
                then: Yup.array()
                    .of(Yup.string().required('Tekst opcji jest wymagany'))
                    .min(2, 'Wymagane są co najmniej 2 opcje')
                    .required('Opcje są wymagane dla pytań wielokrotnego wyboru'),
                otherwise: Yup.array()
            }),
            required: Yup.boolean()
        })
    ).min(1, 'Wymagane jest co najmniej jedno pytanie')
});

const EditSurvey = () => {
    const [survey, setSurvey] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { showNotification } = useContext(UIContext);
    const navigate = useNavigate();
    const { id } = useParams();

    // Pobieranie danych ankiety
    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/surveys/${id}`);
                setSurvey(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Błąd pobierania ankiety');
                setLoading(false);
            }
        };

        fetchSurvey();
    }, [id]);

    // Obsługa przesyłania formularza
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setIsSubmitting(true);

            // Zaktualizuj ankietę
            const response = await api.put(`/surveys/${id}`, values);

            // Pokaż powiadomienie o sukcesie
            showNotification('Ankieta została zaktualizowana pomyślnie!', 'success');

            // Przekieruj do zarządzania ankietami
            navigate('/surveys');
        } catch (error) {
            showNotification(
                error.response?.data?.message || 'Nie udało się zaktualizować ankiety',
                'error'
            );
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    // Ekran ładowania
    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar title="Edytuj ankietę" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Ładowanie...</span>
                            </div>
                            <p className="mt-2">Ładowanie ankiety...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Ekran błędu
    if (error || !survey) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar title="Edytuj ankietę" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-xl text-red-600 mb-2">Błąd</h3>
                            <p className="mb-4">{error || 'Nie znaleziono ankiety'}</p>
                            <button
                                onClick={() => navigate('/surveys')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                                Wróć do ankiet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title="Edytuj ankietę" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edytuj ankietę</h1>

                            <Formik
                                initialValues={survey}
                                validationSchema={SurveySchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                                    <Form>
                                        {/* Tytuł ankiety */}
                                        <div className="mb-6">
                                            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                                                Tytuł ankiety*
                                            </label>
                                            <Field
                                                type="text"
                                                name="title"
                                                id="title"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Wprowadź tytuł ankiety"
                                            />
                                            <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
                                        </div>

                                        {/* Opis ankiety */}
                                        <div className="mb-6">
                                            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                                                Opis (opcjonalnie)
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                id="description"
                                                rows="3"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Wprowadź opis ankiety"
                                            />
                                            <ErrorMessage name="description" component="div" className="text-red-500 mt-1" />
                                        </div>

                                        {/* Sekcja pytań */}
                                        <div className="mb-6">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Pytania*
                                            </label>

                                            <FieldArray name="questions">
                                                {({ remove, push }) => (
                                                    <div>
                                                        {values.questions.map((question, index) => (
                                                            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                                                <div className="flex justify-between mb-3">
                                                                    <h3 className="text-lg font-medium">Pytanie {index + 1}</h3>

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

                                                                {/* Tekst pytania */}
                                                                <div className="mb-3">
                                                                    <label htmlFor={`questions.${index}.question_text`} className="block text-gray-700 mb-1">
                                                                        Tekst pytania*
                                                                    </label>
                                                                    <Field
                                                                        type="text"
                                                                        name={`questions.${index}.question_text`}
                                                                        id={`questions.${index}.question_text`}
                                                                        className="w-full px-3 py-2 border rounded-lg"
                                                                        placeholder="Wprowadź pytanie"
                                                                    />
                                                                    <ErrorMessage name={`questions.${index}.question_text`} component="div" className="text-red-500 mt-1" />
                                                                </div>

                                                                {/* Typ pytania */}
                                                                <div className="mb-3">
                                                                    <label htmlFor={`questions.${index}.question_type`} className="block text-gray-700 mb-1">
                                                                        Typ pytania*
                                                                    </label>
                                                                    <Field
                                                                        as="select"
                                                                        name={`questions.${index}.question_type`}
                                                                        id={`questions.${index}.question_type`}
                                                                        className="w-full px-3 py-2 border rounded-lg"
                                                                    >
                                                                        <option value="rating">Ocena (1-5 gwiazdek)</option>
                                                                        <option value="text">Tekst (komentarz)</option>
                                                                        <option value="multiple_choice">Wybór (wielokrotny wybór)</option>
                                                                    </Field>
                                                                    <ErrorMessage name={`questions.${index}.question_type`} component="div" className="text-red-500 mt-1" />
                                                                </div>

                                                                {/* Opcje dla pytań wielokrotnego wyboru */}
                                                                {values.questions[index].question_type === 'multiple_choice' && (
                                                                    <div className="mb-3">
                                                                        <label className="block text-gray-700 mb-1">
                                                                            Opcje*
                                                                        </label>

                                                                        <FieldArray name={`questions.${index}.options`}>
                                                                            {({ remove: removeOption, push: pushOption }) => (
                                                                                <div>
                                                                                    {values.questions[index].options && values.questions[index].options.map((option, optionIndex) => (
                                                                                        <div key={optionIndex} className="flex items-center mb-2">
                                                                                            <Field
                                                                                                type="text"
                                                                                                name={`questions.${index}.options.${optionIndex}`}
                                                                                                className="flex-1 px-3 py-2 border rounded-lg"
                                                                                                placeholder={`Opcja ${optionIndex + 1}`}
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
                                                                                        Dodaj opcję
                                                                                    </button>

                                                                                    <ErrorMessage name={`questions.${index}.options`} component="div" className="text-red-500 mt-1" />
                                                                                </div>
                                                                            )}
                                                                        </FieldArray>
                                                                    </div>
                                                                )}

                                                                {/* Wymagane */}
                                                                <div className="flex items-center">
                                                                    <Field
                                                                        type="checkbox"
                                                                        name={`questions.${index}.required`}
                                                                        id={`questions.${index}.required`}
                                                                        className="h-4 w-4 text-blue-600 rounded"
                                                                    />
                                                                    <label htmlFor={`questions.${index}.required`} className="ml-2 block text-gray-700">
                                                                        Wymagane pytanie
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
                                                            Dodaj pytanie
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            <ErrorMessage name="questions" component="div" className="text-red-500 mt-1" />
                                        </div>

                                        {/* Status aktywności */}
                                        <div className="mb-6 flex items-center">
                                            <Field
                                                type="checkbox"
                                                name="is_active"
                                                id="is_active"
                                                className="h-4 w-4 text-blue-600 rounded"
                                            />
                                            <label htmlFor="is_active" className="ml-2 block text-gray-700">
                                                Ankieta aktywna
                                            </label>
                                        </div>

                                        {/* Przyciski do przesyłania */}
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => navigate('/surveys')}
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                            >
                                                Anuluj
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
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

export default EditSurvey;