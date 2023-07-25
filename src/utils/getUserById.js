"use server";

import { cache } from "react";

import prisma from "@/db";

export default async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: { username: true, image: true },
  });
  return user;
}
