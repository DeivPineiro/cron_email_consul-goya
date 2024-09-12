require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const moment = require('moment-timezone');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendDailyAppointmentsEmail = async (adminEmail, appointments) => {
  if (appointments.length === 0) {
    console.log(`No hay turnos para hoy. No se enviará correo a ${adminEmail}`);
    return;
  }


  const formatDate = (date) => {
    return moment(date).tz('America/Argentina/Buenos_Aires').format('HH:mm');
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

async function sendReminderEmail(email, appointment) {
  const formatTime = (date) => {
    return moment(date).tz('America/Argentina/Buenos_Aires').format('HH:mm');
  };

  const formatDate = (date) => {
    return moment(date).tz('America/Argentina/Buenos_Aires').format('DD/MM/YYYY');
  };

  const htmlContent = `
  <html>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <header style="background-color: #c396a0; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="margin: 0; font-size: 24px;">Su turno en Consultorio Goya</h1>
      </header>
      <div style="padding: 20px; text-align: left;">
        <p style="font-size: 16px; color: #333333;">Hola! ${appointment.patientName} ${appointment.patientSurName} 👋</p>
        <p style="font-size: 16px; color: #333333;">Te recordamos el <strong>${formatDate(appointment.startTime)}</strong> tienes un turno en Consultorio Goya a las <strong>${formatTime(appointment.startTime)}</strong> hs</p>        
        <p style="font-size: 14px; margin: 0; color: #757575;">
          <i>*Por favor, informar las cancelaciones con al menos 24 horas de antelación.</i>
        </p>
        <p style="font-size: 16px; color: #333333;">Que tenga un excelente día 😊</p>
      </div>
      <footer style="background-color: #c396a0; color: #ffffff; padding: 10px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="font-size: 14px; margin: 0;">2024 © Consultorio Goya™. Todos los derechos reservados.</p>
        <p style="font-size: 12px; margin: 0; color: #e0e0e0;">Este es un correo generado automáticamente, por favor no responder, gracias.</p>
      </footer>
    </div>
  </body>
  </html>
  `;

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Recordatorio de turno - 24 horas antes',
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Recordatorio enviado a ${email}`);
  } catch (error) {
    console.error('Error al enviar el recordatorio:', error.response ? error.response.body : error.message);
  }
}



module.exports = { sendDailyAppointmentsEmail, sendReminderEmail };
