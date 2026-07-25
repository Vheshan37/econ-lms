const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const name = "Krishan Kasthuriarachchi";
const email = "krishankasthuriarachchi@gmail.com";

async function main() {
  console.log("Starting user insertion for Krishan...");

  // 1. Insert Teacher
  try {
    const teacher = await prisma.teacher.upsert({
      where: { email: email },
      update: { name: name, isActive: true },
      create: {
        name: name,
        email: email,
        isActive: true,
      },
    });
    console.log("Successfully upserted Teacher:", teacher);
  } catch (error) {
    console.error("Error upserting Teacher:", error);
  }

  // 2. Insert Student
  try {
    const student = await prisma.student.upsert({
      where: { email: email },
      update: { name: name, school: "Econ LMS School", isActive: true },
      create: {
        name: name,
        email: email,
        school: "Econ LMS School",
        dateOfBirth: new Date("2000-01-01"),
        isActive: true,
      },
    });
    console.log("Successfully upserted Student:", student);
  } catch (error) {
    console.error("Error upserting Student:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
