require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendDailyAppointmentsEmail = async (adminEmail, appointments) => {
  if (appointments.length === 0) {
    console.log(`No hay turnos para hoy. No se enviará correo a ${adminEmail}`);
    return;
  }


  const formatDate = (date) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('es-ES', options).format(new Date(date));
  };

  const appointmentList = appointments.map(appointment =>
    `<li>${formatDate(appointment.startTime)}: ${appointment.patientName} ${appointment.patientSurName}, Consultorio ${appointment.office}</li>`
  ).join('');
  console.log(appointmentList);
  const htmlContent = `
    <html>
    <body>
      <div style="text-align: center;">
        <h1>Aquí están tus turnos del día de hoy</h1>
        <ul style="list-style-type: none; padding: 0; text-align: left; display: inline-block;">
          ${appointmentList}
        </ul>
        <p>Que tengas un gran día hoy 😊</p>
        <footer style="margin-top: 20px;">
          <p style="font-size: 12px; color: #777;">2024 © Consultorio Goya™. Todos los derechos reservados.</p>
         
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