// frontend/src/components/common/ConfirmDialog.js
import React from 'react';

/**
 * Komponent dialogu potwierdzenia
 *
 * @param {Object} props - Właściwości komponentu
 * @param {boolean} props.isOpen - Czy dialog jest otwarty
 * @param {string} props.title - Tytuł dialogu
 * @param {string} props.message - Treść komunikatu
 * @param {string} props.confirmButtonText - Tekst przycisku potwierdzenia (domyślnie "Usuń")
 * @param {string} props.cancelButtonText - Tekst przycisku anulowania (domyślnie "Anuluj")
 * @param {string} props.confirmButtonColor - Kolor przycisku potwierdzenia (domyślnie "red")
 * @param {Function} props.onConfirm - Funkcja wywoływana po potwierdzeniu
 * @param {Function} props.onCancel - Funkcja wywoływana po anulowaniu
 * @returns {JSX.Element|null} Dialog potwierdzenia lub null jeśli zamknięty
 */
const ConfirmDialog = ({
                           isOpen,
                           title = "Potwierdzenie",
                           message,
                           confirmButtonText = "Usuń",
                           cancelButtonText = "Anuluj",
                           confirmButtonColor = "red",
                           onConfirm,
                           onCancel
                       }) => {
    if (!isOpen) return null;

    // Mapowanie kolorów na klasy Tailwind
    const colorMap = {
        red: "bg-red-600 hover:bg-red-700",
        blue: "bg-blue-600 hover:bg-blue-700",
        green: "bg-green-600 hover:bg-green-700",
        yellow: "bg-yellow-600 hover:bg-yellow-700",
        gray: "bg-gray-600 hover:bg-gray-700"
    };

    const buttonColorClass = colorMap[confirmButtonColor] || colorMap.red;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {title}
                </h3>
                <p className="text-gray-600 mb-6">
                    {message}
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-md ${buttonColorClass}`}
                    >
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;