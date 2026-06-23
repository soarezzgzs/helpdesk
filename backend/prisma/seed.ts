import prisma from "../src/prisma/prisma";
import bcrypt from "bcrypt";

async function main() {
  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@admin.com",
      password: await bcrypt.hash("123456", 10),
      role: "admin",
    },
  });

  await prisma.user.create({
    data: {
      name: "technician1",
      email: "technician1@technician.com",
      password: await bcrypt.hash("123456", 10),
      role: "technician",
    },
  })

  await prisma.user.create({
    data: {
      name: "technician2",
      email: "technician2@technician.com",
      password: await bcrypt.hash("123456", 10),
      role: "technician",
    },
  })

  await prisma.user.create({
    data: {
      name: "technician3",
      email: "technician3@technician.com",
      password: await bcrypt.hash("123456", 10),
      role: "technician",
    },
  })

  await prisma.service.create({
    data: {
      name: "Service 1",
      description: "Description 1",
      amount: 100,
      active: true,
    },
  })

  await prisma.service.create({
    data: {
      name: "Service 2",
      description: "Description 2",
      amount: 100,
      active: true,
    },
  })

  await prisma.service.create({
    data: {
      name: "Service 3",
      description: "Description 3",
      amount: 100,
      active: true,
    },
  })

  await prisma.service.create({
    data: {
      name: "Service 4",
      description: "Description 4",
      amount: 100,
      active: true,
    },
  })

  await prisma.service.create({
    data: {
      name: "Service 5",
      description: "Description 5",
      amount: 100,
      active: true,
    },
  })
}

main()
  .then(() => {
    console.log("Seed executado com sucesso!");
  })
  .catch((error) => {
    console.error(error);
  });