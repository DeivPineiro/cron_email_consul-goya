const cron = require('node-cron');
const { sendDailyAppointmentsEmail } = require('./services/emailServices.js');
const { getAdminEmails, getTodaysAppointmentsForAdmin } = require('./services/appointmentService.js');

//8 AM cada día
cron.schedule('0 8 * * *', async () => {
  console.log('Iniciando tarea de envío de correos de turnos diarios.');

  try {
    const admins = await getAdminEmails();
    for (const admin of admins) {
      const appointments = await getTodaysAppointmentsForAdmin(admin.id);
      await sendDailyAppointmentsEmail(admin.email, appointments);
    }
  } catch (error) {
    console.error('Error durante la ejecución del cron job:', error);
  }
});
