// frontend/src/components/landing/LandingFAQ.js
import React from 'react';

const LandingFAQ = () => {
    const faqItems = [
        {
            question: 'Czy muszę mieć wiedzę techniczną, aby korzystać z systemu?',
            answer: 'Nie, nasz system został zaprojektowany z myślą o prostocie obsługi. Interfejs jest intuicyjny, a generowanie kodów QR i tworzenie ankiet odbywa się w kilku prostych krokach. Nie potrzebujesz wiedzy programistycznej ani technicznej.'
        },
        {
            question: 'Jak klienci skanują kody QR?',
            answer: 'Większość nowoczesnych smartfonów ma wbudowane czytniki kodów QR w aparacie. Klient musi jedynie otworzyć aparat, skierować go na kod QR, a następnie dotknąć wyświetlanego linku. Niektóre starsze urządzenia mogą wymagać dedykowanej aplikacji do skanowania kodów QR.'
        },
        {
            question: 'Czy mogę dostosować wygląd ankiety do mojej marki?',
            answer: 'Tak, w planach Pro oraz w ograniczonym zakresie w planie Podstawowym możesz dostosować ankietę do swojej marki, dodając logo, zmieniając kolory i czcionki, aby lepiej odzwierciedlały tożsamość Twojej firmy.'
        },
        {
            question: 'Czy opinie klientów są anonimowe?',
            answer: 'Tak, wszystkie opinie zbierane przez nasz system są domyślnie anonimowe. Klienci mogą jednak dobrowolnie podać swoje dane kontaktowe, jeśli chcą otrzymać odpowiedź na swoją opinię.'
        },
        {
            question: 'Czy mogę wyeksportować zebrane dane?',
            answer: 'Tak, w planach Podstawowym i Pro możesz eksportować zebrane dane w popularnych formatach, takich jak CSV, aby móc analizować je w innych narzędziach lub tworzyć własne raporty.'
        },
        {
            question: 'Czy mogę utworzyć wiele różnych ankiet?',
            answer: 'Tak, możliwość tworzenia wielu ankiet zależy od wybranego planu. Plan Darmowy umożliwia utworzenie jednej aktywnej ankiety, plan Podstawowy - pięciu ankiet, a plan Pro nie ma ograniczeń w liczbie ankiet.'
        }
    ];

    return (
        <div id="faq" className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">FAQ</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Najczęściej zadawane pytania
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Odpowiedzi na pytania, które mogą Cię interesować.
                    </p>
                </div>

                <div className="mt-12 max-w-3xl mx-auto divide-y-2 divide-gray-200">
                    {faqItems.map((item, index) => (
                        <div key={index} className="py-6">
                            <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                            <p className="mt-2 text-gray-600">{item.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Masz inne pytanie? <a href="mailto:kontakt@qropinion.pl" className="text-blue-600 hover:text-blue-500">Skontaktuj się z nami</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingFAQ;