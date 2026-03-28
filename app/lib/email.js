// lib/email.js
import nodemailer from 'nodemailer';

// Validation rules
export const validateContactForm = (data) => {
  const errors = [];
  const { name, email, phone, message, agreement } = data;

  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Имя должно содержать минимум 2 символа' });
  }

  if (!email || !/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Введите корректный email адрес' });
  }

  if (!phone || phone.replace(/\D/g, '').length < 10) {
    errors.push({ field: 'phone', message: 'Введите корректный номер телефона' });
  }

  if (!message || message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Сообщение должно содержать минимум 10 символов' });
  }

  if (!agreement) {
    errors.push({ field: 'agreement', message: 'Необходимо согласие на обработку данных' });
  }

  return errors;
};

// Create email transporter
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  // For SMTP (use this for most email providers)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email function
export const sendEmail = async ({ name, email, phone, message, agreement }) => {
  try {
    const transporter = createTransporter();

    // HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ffca28; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; color: #333; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0; color: #000;">Новая заявка с сайта Эполет</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Имя:</div>
              <div class="value">${escapeHtml(name)}</div>
            </div>
            <div class="field">
              <div class="label">📞 Телефон:</div>
              <div class="value">${escapeHtml(phone)}</div>
            </div>
            <div class="field">
              <div class="label">✉️ Email:</div>
              <div class="value">${escapeHtml(email)}</div>
            </div>
            <div class="field">
              <div class="label">💬 Сообщение:</div>
              <div class="value">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
            </div>
            <div class="field">
              <div class="label">✅ Согласие на обработку данных:</div>
              <div class="value">${agreement ? 'Да' : 'Нет'}</div>
            </div>
          </div>
          <div class="footer">
            <p>Это письмо было отправлено через форму обратной связи на сайте epolet.ru</p>
            <p>Время отправки: ${new Date().toLocaleString('ru-RU')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Эполет" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || 'partner@epolet5.ru',
      replyTo: email,
      subject: `Новое сообщение от ${name}`,
      html: htmlTemplate,
      text: `
Новая заявка с сайта Эполет

Имя: ${name}
Телефон: ${phone}
Email: ${email}
Сообщение: ${message}
Согласие на обработку данных: ${agreement ? 'Да' : 'Нет'}

---
Время отправки: ${new Date().toLocaleString('ru-RU')}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}