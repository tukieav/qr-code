// frontend/src/components/landing/LandingTestimonials.js
import React from 'react';

const LandingTestimonials = () => {
    const testimonials = [
        {
            businessName: 'Restauracja "Smacznego"',
            ownerName: 'Jan Kowalski',
            rating: 5,
            comment: 'Dzięki QR Opinion zdecydowanie zwiększyliśmy liczbę otrzymywanych opinii od naszych gości. Teraz możemy szybko reagować na uwagi i poprawiać jakość obsługi. System jest prosty w obsłudze, a analiza danych daje nam cenne wskazówki.',
            initial: 'R'
        },
        {
            businessName: 'Kawiarnia "Aromatyczna"',
            ownerName: 'Anna Nowak',
            rating: 4,
            comment: 'Intuicyjny interfejs i szybkość wdrożenia zdecydowanie wyróżniają QR Opinion. Nasi klienci chętnie skanują kody QR umieszczone na stolikach, a my mamy jasny obraz tego, co podoba się naszym gościom, a co wymaga poprawy.',
            initial: 'K'
        },
        {
            businessName: 'Salon Fryzjerski "Elegancja"',
            ownerName: 'Magdalena Wiśniewska',
            rating: 5,
            comment: 'To, co najbardziej doceniam w QR Opinion, to prostota wdrożenia i użytkowania. Nasze klientki chętnie dzielą się opiniami po wizycie, a my możemy śledzić, które usługi cieszą się największym uznaniem. Dzięki temu możemy lepiej planować ofertę i szkolenia.',
            initial: 'S'
        }
    ];

    // Funkcja renderująca gwiazdki oceny
    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <div id="testimonials" className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Opinie</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Co mówią nasi klienci
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Poznaj doświadczenia firm, które już korzystają z naszego systemu zbierania opinii.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-xl font-bold text-blue-600">{testimonial.initial}</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">{testimonial.businessName}</h3>
                                        <p className="text-sm text-gray-500">Właściciel: {testimonial.ownerName}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex">
                                        {renderStars(testimonial.rating)}
                                    </div>
                                    <p className="mt-4 text-gray-600">
                                        "{testimonial.comment}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingTestimonials;