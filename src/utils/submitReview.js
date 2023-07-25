"use server";

import prisma from "@/db";
import { removeFromPlaylist } from "./getPlaylist";

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

function updateReviewSpread(
  reviewSpread,
  starCount,
  existingReviewStar = false
) {
  // Star counts are from 0.5 to 5 with 0.5 intervals, so multiplying by 2 gives us an index
  // Subtract 1 since arrays are 0-indexed
  const index = starCount * 2 - 1;

  // Check that the index is within array bounds
  if (index >= 0 && index < reviewSpread.length) {
    // Increment the count at the calculated index
    reviewSpread[index] += 1;
    if (existingReviewStar) {
      const secondIndex = existingReviewStar * 2 - 1;
      reviewSpread[secondIndex] -= 1;
    }
  } else {
    console.error(`Invalid star count: ${starCount}`);
  }

  return reviewSpread;
}

export async function submitRating(gameId, stars, author) {
  const arr = [];

  try {
    const existingReview = await prisma.review.findUnique({
      where: {
        gameId_authorId: { gameId: gameId, authorId: author },
      },
      select: {
        Stars: true,
      },
    });
    const review = await prisma.review.upsert({
      where: { gameId_authorId: { gameId: gameId, authorId: author } }, //use them here
      update: {
        Stars: stars,
      },
      create: {
        game: {
          connect: { gameId: gameId },
        },
        Stars: stars,
        author: {
          connect: { id: author },
        },
      },
    });

    await removeFromPlaylist(gameId, author);
    const game = await prisma.game.findUnique({ where: { gameId: gameId } });

    if (!existingReview || existingReview?.Stars <= 0) {
      let newTotalStars;
      if (stars <= 0) {
        console.log("test");
        return "review text only submited";
      }

      // Calculate the new total stars and review count
      if (game.stars == -1) {
        newTotalStars = stars;
      } else {
        newTotalStars = game.stars + stars;
      }
      const newReviewCount = game.reviewCount + 1;

      // Calculate the new average rating and keep only one decimal
      const newAverageRating = parseFloat(
        (newTotalStars / newReviewCount).toFixed(1)
      );

      const newSpread = updateReviewSpread(game.reviewSpread, stars);
      const oldProfileSpread = await getProfileSpread(author);
      const newProfileSpread = await updateReviewSpread(
        oldProfileSpread,
        stars
      );
      await prisma.profile.update({
        where: { userId: author },
        data: {
          reviewSpread: newProfileSpread,
          reviewCount: {
            increment: 1,
          },
        },
      });
      // Update the game with the new average rating, total stars, and review count
      await prisma.game.update({
        where: { gameId: gameId },
        data: {
          averageRating: newAverageRating,
          stars: newTotalStars,
          reviewCount: newReviewCount,
          reviewSpread: newSpread,
        },
      });

      return review;
    } else {
      let newTotalStars;
      if (stars <= 0) {
        console.log("test");
        return "review text only submitted";
      }

      // Calculate the new total stars and review count

      newTotalStars = game.stars + stars - existingReview.Stars;

      const newReviewCount = game.reviewCount;

      // Calculate the new average rating and keep only one decimal
      const newAverageRating = parseFloat(
        (newTotalStars / newReviewCount).toFixed(1)
      );

      const newSpread = updateReviewSpread(
        game.reviewSpread,
        stars,
        existingReview.Stars
      );
      const oldProfileSpread = await getProfileSpread(author);
      const newProfileSpread = await updateReviewSpread(
        oldProfileSpread,
        stars,
        existingReview.Stars
      );
      await prisma.profile.update({
        where: { userId: author },
        data: {
          reviewSpread: newProfileSpread,
        },
      });

      // Update the game with the new average rating, total stars, and review count
      await prisma.game.update({
        where: { gameId: gameId },
        data: {
          averageRating: newAverageRating,
          stars: newTotalStars,
          reviewCount: newReviewCount,
          reviewSpread: newSpread,
        },
      });

      return review;
    }

    return "rated";
  } catch (e) {
    return e;
  }
}

export default async function submitReview(
  gameId,
  content,
  stars,
  platform,
  status,
  tldr,
  author,
  title = ""
) {
  const arr = [];
  try {
    arr.push(tldr.Gameplay);
    arr.push(tldr.Graphics);
    arr.push(tldr.Story);
    arr.push(tldr.Price);
    const existingReview = await prisma.review.findUnique({
      where: {
        gameId_authorId: { gameId: gameId, authorId: author },
      },
      select: {
        Stars: true,
      },
    });
    const review = await prisma.review.upsert({
      where: { gameId_authorId: { gameId: gameId, authorId: author } }, //use them here
      update: {
        content: content,
        Stars: stars,
        platform: platform,
        gameStatus: status,
        tldr: arr,
        title: title,
      },
      create: {
        game: {
          connect: { gameId: gameId },
        },
        content: content,
        Stars: stars,
        platform: platform,
        gameStatus: status,
        tldr: arr,
        title: title,
        author: {
          connect: { id: author },
        },
      },
    });

    await removeFromPlaylist(gameId, author);

    // Get the current game data
    const game = await prisma.game.findUnique({ where: { gameId: gameId } });

    if (!existingReview || existingReview?.Stars <= 0) {
      let newTotalStars;
      if (stars <= 0) {
        console.log("test");
        return "review text only submited";
      }

      // Calculate the new total stars and review count
      if (game.stars == -1) {
        newTotalStars = stars;
      } else {
        newTotalStars = game.stars + stars;
      }
      const newReviewCount = game.reviewCount + 1;

      // Calculate the new average rating and keep only one decimal
      const newAverageRating = parseFloat(
        (newTotalStars / newReviewCount).toFixed(1)
      );

      const newSpread = updateReviewSpread(game.reviewSpread, stars);
      const oldProfileSpread = await getProfileSpread(author);
      const newProfileSpread = await updateReviewSpread(
        oldProfileSpread,
        stars
      );
      await prisma.profile.update({
        where: { userId: author },
        data: {
          reviewSpread: newProfileSpread,
          reviewCount: {
            increment: 1,
          },
        },
      });
      // Update the game with the new average rating, total stars, and review count
      await prisma.game.update({
        where: { gameId: gameId },
        data: {
          averageRating: newAverageRating,
          stars: newTotalStars,
          reviewCount: newReviewCount,
          reviewSpread: newSpread,
        },
      });

      return review;
    } else {
      let newTotalStars;
      if (stars <= 0) {
        console.log("test");
        return "review text only submitted";
      }

      // Calculate the new total stars and review count

      newTotalStars = game.stars + stars - existingReview.Stars;

      const newReviewCount = game.reviewCount;

      // Calculate the new average rating and keep only one decimal
      const newAverageRating = parseFloat(
        (newTotalStars / newReviewCount).toFixed(1)
      );

      const newSpread = updateReviewSpread(
        game.reviewSpread,
        stars,
        existingReview.Stars
      );
      const oldProfileSpread = await getProfileSpread(author);
      const newProfileSpread = await updateReviewSpread(
        oldProfileSpread,
        stars,
        existingReview.Stars
      );
      await prisma.profile.update({
        where: { userId: author },
        data: {
          reviewSpread: newProfileSpread,
        },
      });

      // Update the game with the new average rating, total stars, and review count
      await prisma.game.update({
        where: { gameId: gameId },
        data: {
          averageRating: newAverageRating,
          stars: newTotalStars,
          reviewCount: newReviewCount,
          reviewSpread: newSpread,
        },
      });

      return review;
    }
  } catch (error) {
    console.error("Error submitting review: ", error);
  }
}
