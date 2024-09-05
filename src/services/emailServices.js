require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const moment = require('moment-timezone');  // Importa moment-timezone

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendDailyAppointmentsEmail = async (adminEmail, appointments) => {
  if (appointments.length === 0) {
    console.log(`No hay turnos para hoy. No se enviará correo a ${adminEmail}`);
    return;
  }

  // Formatear la fecha con moment-timezone en el uso horario de Argentina
  const formatDate = (date) => {
    return moment(date).tz('America/Argentina/Buenos_Aires').format('HH:mm');  // Formato 24 horas
  };

  const appointmentList = appointments.map(appointment =>
    `<li>${formatDate(appointment.startTime)}: ${appointment.patientName} ${appointment.patientSurName}, Consultorio ${appointment.office}</li>`
  ).join('');
  
  const htmlContent = `
  <html>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <header style="background-color: #c396a0; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="margin: 0; font-size: 24px;">Tus Turnos del Día</h1>
      </header>
      <div style="padding: 20px; text-align: left;">
        <p style="font-size: 16px; color: #333333;">Hola!👋,</p>
        <p style="font-size: 16px; color: #333333;">Te recordamos tus turnos para el día de hoy:</p>
        <ul style="list-style-type: none; padding: 0; margin: 20px 0; font-size: 16px;">
          ${appointmentList}
        </ul>
        <p style="font-size: 16px; color: #333333;">Que tenga un exelente día 😊</p>
      </div>
      <footer style="background-color: #c396a0; color: #ffffff; padding: 10px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="font-size: 14px; margin: 0;">2024 © Consultorio Goya™. Todos los derechos reservados.</p>
        <p style="font-size: 12px; margin: 0; color: #e0e0e0;">Este es un correo generado automáticamente, por favor no respondas.</p>
      </footer>
    </div>
  </body>
  </html>
`;

  const msg = {
    to: adminEmail,
    from: process.env.EMAIL_FROM,
    subject: 'Tus turnos diarios',
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Correo enviado a ${adminEmail}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error.response ? error.response.body : error.message);
  }
};

module.exports = { sendDailyAppointmentsEmail };
