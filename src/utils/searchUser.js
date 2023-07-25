"use server";

const { default: prisma } = require("@/db");

export async function findUsers(username) {
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: username,
        mode: "insensitive",
      },
    },
    take: 50,
  });

  return users;
}
