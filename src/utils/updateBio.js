"use server";

import prisma from "@/db";

export default async function updateBio(bio, userId) {
  try {
    // Check if the user already has a profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    // If a profile exists, update it. If not, create a new one.
    if (existingProfile) {
      await prisma.profile.update({
        where: { userId },
        data: { bio },
      });
    } else {
      await prisma.profile.create({
        data: {
          bio,
          userId,
        },
      });
    }

    return true;
  } catch (error) {
    throw error;
  }
}

export async function updateLocation(location, userId) {
  try {
    // Check if the user already has a profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    // If a profile exists, update it. If not, create a new one.
    if (existingProfile) {
      await prisma.profile.update({
        where: { userId },
        data: { location: location },
      });
    } else {
      await prisma.profile.create({
        data: {
          location: location,
          userId,
        },
      });
    }

    return true;
  } catch (error) {
    throw error;
  }
}
