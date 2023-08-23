"use server";

import prisma from "@/db";

export default async function submitBorder(userId, border) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      border: border,
    },
  });

  return user;
}
