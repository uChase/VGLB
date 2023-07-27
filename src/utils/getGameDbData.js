"use server";
import prisma from "../db";
import getFollowing from "./getFollowing";
import getIsLiked from "./getIsLiked";
import getUserById from "./getUserById";

export default async function getGameDbData(
  gameId,
  takeAmount,
  ratingSort = "All",
  order = "Popular",
  userId
) {
  let follows = [];
  if (userId && order == "Friends") {
    // Retrieve the users this user is following
    follows = await getFollowing(userId);
  }
  let whereClause = {};

  if (order === "Friends") {
    whereClause.authorId = { in: follows }; // add condition for authorId if order is "Friends"
  } else {
    whereClause.content = { not: "" }; // filter out empty content if order is not "Friends"

    if (ratingSort !== "All") {
      whereClause.Stars = parseFloat(ratingSort); // add condition for Stars if ratingSort is not "All"
    }
  }

  const game = await prisma.game.upsert({
    where: { gameId: gameId },
    update: {},
    create: {
      gameId: gameId,
      stars: -1,
    },
    include: {
      reviews: {
        where: whereClause,
        take: takeAmount,
        include: {
          comments: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          ...(order === "Popular" ? { likesCount: "desc" } : {}),
          ...(order === "Recent" ? { createdAt: "desc" } : {}),
        },
      },
    },
  });

  return game;
}

async function loadReviewData(
  gameId,
  takeAmount,
  ratingSort = "All",
  order = "Popular",
  skipAmount = 0,
  userId
) {
  let follows = [];
  if (userId && order == "Friends") {
    // Retrieve the users this user is following
    follows = await getFollowing(userId);
  }
  let whereClause = {};

  if (order === "Friends") {
    whereClause.authorId = { in: follows }; // add condition for authorId if order is "Friends"
  } else {
    whereClause.content = { not: "" }; // filter out empty content if order is not "Friends"

    if (ratingSort !== "All") {
      whereClause.Stars = parseFloat(ratingSort); // add condition for Stars if ratingSort is not "All"
    }
  }

  const game = await prisma.game.upsert({
    where: { gameId: gameId },
    update: {},
    create: {
      gameId: gameId,
      stars: -1,
    },
    include: {
      reviews: {
        where: whereClause,
        skip: skipAmount,
        take: takeAmount,
        include: {
          comments: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          ...(order === "Popular" ? { likesCount: "desc" } : {}),
          ...(order === "Recent" ? { createdAt: "desc" } : {}),
        },
      },
    },
  });
  return game;
}

export async function loadRevAndUser(
  gameId,
  userId,
  rateSort = "All",
  sort = "Popular",
  skip
) {
  const gameReviewData = await loadReviewData(
    gameId,
    15,
    rateSort,
    sort,
    skip,
    userId
  );
  gameReviewData.reviews.map(async (rev) => {
    const author = await getUserById(rev.authorId);
    rev.author = author;
    return rev;
  });
  for (let i = 0; i < gameReviewData.reviews.length; i++) {
    const author = await getUserById(gameReviewData.reviews[i].authorId);
    gameReviewData.reviews[i].author = author;
    if (userId) {
      const liked = await getIsLiked(gameReviewData.reviews[i].id, userId);
      gameReviewData.reviews[i].liked = liked;
    }
  }
  return gameReviewData;
}
