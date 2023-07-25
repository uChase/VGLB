"use server";

import prisma from "@/db";

export async function updateFavoriteGames(games, userId) {
  try {
    // Check if the user already has a profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    let game1 = games[0]?.id + "";
    if (typeof game1 == "undefined") {
      game1 = "";
    }
    let game2 = games[1]?.id + "";
    if (game2 == "undefined") {
      game2 = "empty";
    }
    let game3 = games[2]?.id + "";
    if (game3 == "undefined") {
      game3 = "empty";
    }
    let game4 = games[3]?.id + "";
    if (game4 == "undefined") {
      game4 = "empty";
    }
    let game5 = games[4]?.id + "";
    if (game5 == "undefined") {
      game5 = "empty";
    }

    // If a profile exists, update it. If not, create a new one.
    await prisma.profile.update({
      where: { userId },
      data: {
        favGames: { set: [game1, game2, game3, game4, game5] },
      },
    });

    return true;
  } catch (error) {
    throw error;
  }
}
