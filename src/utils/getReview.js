"use server";

import prisma from "@/db";

async function getProfileSpread(userId) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
    select: {
      reviewSpread: true,
    },
  });

  return profile.reviewSpread;
}

function updateReviewSpread(reviewSpread, starCount) {
  // Star counts are from 0.5 to 5 with 0.5 intervals, so multiplying by 2 gives us an index
  // Subtract 1 since arrays are 0-indexed
  const index = starCount * 2 - 1;

  // Check that the index is within array bounds
  if (index >= 0 && index < reviewSpread.length) {
    // Increment the count at the calculated index
    reviewSpread[index] -= 1;
  } else {
    console.error(`Invalid star count: ${starCount}`);
  }

  return reviewSpread;
}

export default async function getReviewById(id) {
  const revId = parseInt(id);
  const review = await prisma.review.findUnique({
    where: { id: revId },
  });
  return review;
}

export async function getReviewByUserId(userId, gameId) {
  try {
    const review = await prisma.review.findUnique({
      where: {
        gameId_authorId: {
          gameId: gameId,
          authorId: userId,
        },
      },
    });

    return review;
  } catch (error) {
    console.error("An error occurred while fetching the review", error);
    return null;
  }
}

export async function deleteReview(userId, gameId) {
  // First, check if the review exists
  const review = await prisma.review.findUnique({
    where: {
      gameId_authorId: {
        gameId: gameId,
        authorId: userId,
      },
    },
  });

  // If no review found, return an error or handle as necessary
  if (!review) {
    throw new Error("No review found");
  }

  // If the review exists, delete it
  const deletedReview = await prisma.review.delete({
    where: {
      gameId_authorId: {
        gameId: gameId,
        authorId: userId,
      },
    },
  });

  const game = await prisma.game.findUnique({
    where: { gameId: gameId },
    include: {
      reviews: true,
    },
  });
  let newReviewCount;
  if (deletedReview.Stars <= 0) {
    newReviewCount = game.reviewCount;
  } else {
    newReviewCount = game.reviewCount - 1;
  }
  const newStars = game.stars - deletedReview.Stars;
  let newAverage = -1;
  if (newReviewCount != 0) {
    newAverage = (newStars / newReviewCount).toFixed(1);
  }

  const newSpread = updateReviewSpread(game.reviewSpread, deletedReview.Stars);
  const oldProfileSpread = await getProfileSpread(userId);
  const newProfileSpread = updateReviewSpread(
    oldProfileSpread,
    deletedReview.Stars
  );

  await prisma.profile.update({
    where: { userId: userId },
    data: {
      reviewSpread: newProfileSpread,
      reviewCount: {
        decrement: 1,
      },
    },
  });

  newAverage = parseFloat(newAverage);
  await prisma.game.update({
    where: { gameId: gameId },
    data: {
      averageRating: newAverage,
      stars: newStars,
      reviewCount: newReviewCount,
      reviewSpread: newSpread,
    },
  });
}

export async function getHasReview(userId, gameId) {
  if (!userId) {
    return false;
  }
  const review = await prisma.review.findUnique({
    where: {
      gameId_authorId: {
        gameId: gameId,
        authorId: userId,
      },
    },
  });

  return review;
}
