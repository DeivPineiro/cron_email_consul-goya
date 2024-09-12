const { sendDailyAppointmentsEmail, sendReminderEmail } = require('./services/emailServices.js');
const { getAdminEmails, getTodaysAppointmentsForAdmin, getAppointmentsForNext24Hours } = require('./services/appointmentService.js');

async function runDailyTask() {
  console.log('Iniciando tarea de envío de correos de turnos diarios.');

  try {
    const admins = await getAdminEmails();
    for (const admin of admins) {
      const appointments = await getTodaysAppointmentsForAdmin(admin.id);
      await sendDailyAppointmentsEmail(admin.email, appointments);
    }
    console.log('Correos de turnos diarios enviados con éxito.');
  } catch (error) {
    console.error('Error durante la ejecución del cron job diario:', error);
  }
}

async function runReminderTask() {
  console.log('Iniciando tarea de envío de recordatorios de turnos en 24hs.');

  try {
    const appointments = await getAppointmentsForNext24Hours();
    for (const appointment of appointments) {
      await sendReminderEmail(appointment.email, appointment);
    }
    console.log('Recordatorios de turnos enviados con éxito.');
  } catch (error) {
    console.error('Error durante la ejecución del cron job de recordatorio:', error);
  }
}

async function runAllTasks() {
  await runDailyTask();    
  await runReminderTask(); 
}

runAllTasks();
