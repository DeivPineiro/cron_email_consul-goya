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

module.exports = { getAdminEmails, getTodaysAppointmentsForAdmin };
