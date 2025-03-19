// utils/emailService.js
const nodemailer = require('nodemailer');

// Konfiguracja transportera email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

/**
 * Wysyła email powitalny do nowej firmy
 * @param {Object} business - Obiekt firmy
 * @returns {Promise} - Rezultat wysyłania
 */
exports.sendWelcomeEmail = async (business) => {
    try {
        const message = {
            from: `"QR Opinion" <${process.env.EMAIL_FROM || 'no-reply@qropinion.com'}>`,
            to: business.contact_email,
            subject: 'Witamy w serwisie QR Opinion!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Witaj ${business.business_name}!</h2>
          <p>Dziękujemy za dołączenie do serwisu QR Opinion. Jesteśmy podekscytowani, że wybrałeś nasze rozwiązanie do zbierania opinii klientów.</p>
          
          <p>Twoje konto jest już aktywne i możesz zacząć korzystać z naszej platformy:</p>
          
          <ul>
            <li>Tworzenie ankiet</li>
            <li>Generowanie kodów QR</li>
            <li>Zbieranie i analizowanie opinii klientów</li>
          </ul>
          
          <p>Masz dostęp do <strong>planu próbnego</strong>, który wygasa za 14 dni. W tym czasie możesz korzystać z podstawowych funkcji platformy.</p>
          
          <p>Jeśli masz jakiekolwiek pytania, po prostu odpowiedz na tego emaila, a nasz zespół wsparcia z przyjemnością Ci pomoże.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              © ${new Date().getFullYear()} QR Opinion. Wszelkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      `
        };

        const info = await transporter.sendMail(message);
        console.log(`Email wysłany: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Błąd podczas wysyłania emaila powitalnego:', error);
        throw error;
    }
};

/**
 * Wysyła email z resetem hasła
 * @param {Object} business - Obiekt firmy
 * @param {String} resetToken - Token resetujący hasło
 * @param {String} resetUrl - URL do resetowania hasła
 * @returns {Promise} - Rezultat wysyłania
 */
exports.sendPasswordResetEmail = async (business, resetToken, resetUrl) => {
    try {
        const message = {
            from: `"QR Opinion" <${process.env.EMAIL_FROM || 'no-reply@qropinion.com'}>`,
            to: business.contact_email,
            subject: 'Reset hasła w serwisie QR Opinion',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset hasła</h2>
          <p>Otrzymaliśmy prośbę o zresetowanie hasła dla konta ${business.business_name}.</p>
          
          <p>Aby zresetować hasło, kliknij poniższy link:</p>
          
          <p><a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Zresetuj hasło</a></p>
          
          <p>Link jest ważny przez 60 minut.</p>
          
          <p>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość lub skontaktuj się z naszym zespołem wsparcia.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              © ${new Date().getFullYear()} QR Opinion. Wszelkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      `
        };

        const info = await transporter.sendMail(message);
        console.log(`Email z resetem hasła wysłany: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Błąd podczas wysyłania emaila z resetem hasła:', error);
        throw error;
    }
};

/**
 * Wysyła email z powiadomieniem o nowej opinii
 * @param {Object} business - Obiekt firmy
 * @param {Object} feedback - Obiekt opinii
 * @returns {Promise} - Rezultat wysyłania
 */
exports.sendNewFeedbackNotification = async (business, feedback) => {
    try {
        // Formatowanie oceny gwiazdkowej
        const ratingStars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);

        const message = {
            from: `"QR Opinion" <${process.env.EMAIL_FROM || 'no-reply@qropinion.com'}>`,
            to: business.contact_email,
            subject: 'Nowa opinia od klienta',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nowa opinia od klienta!</h2>
          <p>Otrzymałeś nową opinię od klienta w dniu ${new Date(feedback.submission_date).toLocaleDateString()}.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Ocena:</strong> ${ratingStars} (${feedback.rating}/5)</p>
            ${feedback.comment ? `<p><strong>Komentarz:</strong> "${feedback.comment}"</p>` : ''}
          </div>
          
          <p><a href="${process.env.FRONTEND_URL}/feedback/${feedback._id}" style="background-color: #4285F4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Zobacz szczegóły opinii</a></p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              © ${new Date().getFullYear()} QR Opinion. Wszelkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      `
        };

        const info = await transporter.sendMail(message);
        console.log(`Powiadomienie o nowej opinii wysłane: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Błąd podczas wysyłania powiadomienia o nowej opinii:', error);
        throw error;
    }
};