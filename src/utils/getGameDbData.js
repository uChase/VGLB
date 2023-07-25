"use server";
import prisma from "../db";
import getIsLiked from "./getIsLiked";
import getUserById from "./getUserById";

export default async function getGameDbData(
  gameId,
  takeAmount,
  ratingSort = "All",
  order = "Popular"
) {
  const game = await prisma.game.upsert({
    where: { gameId: gameId },
    update: {},
    create: {
      gameId: gameId,
      stars: -1,
    },
    include: {
      reviews: {
        where:
          ratingSort !== "All"
            ? { Stars: parseFloat(ratingSort), content: { not: null, not: "" } }
            : { content: { not: null, not: "" } },
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
  skipAmount = 0
) {
  const game = await prisma.game.upsert({
    where: { gameId: gameId },
    update: {},
    create: {
      gameId: gameId,
      stars: -1,
    },
    include: {
      reviews: {
        where:
          ratingSort !== "All"
            ? { Stars: parseFloat(ratingSort), content: { not: null, not: "" } }
            : { content: { not: null, not: "" } },
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
  const gameReviewData = await loadReviewData(gameId, 15, rateSort, sort, skip);
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
