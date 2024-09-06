const { sendDailyAppointmentsEmail } = require('./services/emailServices.js');
const { getAdminEmails, getTodaysAppointmentsForAdmin } = require('./services/appointmentService.js');

async function runTask() {
  console.log('Iniciando tarea de envío de correos de turnos diarios.');

  try {
    const admins = await getAdminEmails();
    for (const admin of admins) {
      const appointments = await getTodaysAppointmentsForAdmin(admin.id);
      await sendDailyAppointmentsEmail(admin.email, appointments);
    }
    console.log('Correos de turnos diarios enviados con éxito.');
  } catch (error) {
    console.error('Error durante la ejecución del cron job:', error);
  }
}

runTask();
