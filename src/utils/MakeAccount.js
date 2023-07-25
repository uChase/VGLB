"use server";
import bcrypt from "bcrypt";
import prisma from "@/db";
require("dotenv").config();

export default async function makeAccount(username, email, password) {
  const existingUserWithUsername = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  const existingUserWithEmail = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUserWithUsername) {
    throw new Error("User with this username already exists.");
  }

  if (existingUserWithEmail) {
    throw new Error("User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
      image: "https://d38r4fcwx16olc.cloudfront.net/default.jpg",
      profile: {
        create: {
          favGames: { set: ["empty", "empty", "empty", "empty", "empty"] },
        },
      },
    },
  });

  return "good";
}
