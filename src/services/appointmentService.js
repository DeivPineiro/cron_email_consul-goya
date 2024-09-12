const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAdminEmails = async () => {
  return await prisma.user.findMany({
    where: { role: 'admin' },
    select: { email: true, id: true },
  });
};

const getTodaysAppointmentsForAdmin = async (adminId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return await prisma.appointment.findMany({
    where: {
      userId: adminId,
      startTime: {
        gte: today,
        lt: tomorrow,
      },
    },
    select: { 
      patientName: true, 
      patientSurName: true,  
      startTime: true,
      office: true,  
    },
  });
};

async function getAppointmentsForNext24Hours() {
  const currentTime = new Date();
  const next24Hours = new Date();
  next24Hours.setHours(currentTime.getHours() + 48);

  return await prisma.appointment.findMany({
    where: {
      startTime: {
        gte: currentTime,
        lte: next24Hours,
      },
    },
    select: {
      patientName: true,
      patientSurName: true,
      startTime: true,
      office: true,
      email: true,  
    },
  });
}

module.exports = { getAdminEmails, getTodaysAppointmentsForAdmin, getAppointmentsForNext24Hours };
