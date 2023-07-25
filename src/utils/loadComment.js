"use server";

import prisma from "@/db";

export default async function loadMore(revId, skip, searchRatio, userId) {
  const reviewId = parseInt(revId);
  const skipAmount = parseInt(skip);
  let comments;
  if (searchRatio == "true") {
    comments = await prisma.reviewComment.findMany({
      where: {
        reviewId: reviewId,
        isRatio: true,
        authorId: {
          not: userId,
        },
      },

      orderBy: {
        totalLikes: "desc",
      },
      include: {
        author: true,
      },
      skip: skipAmount,
      take: 10,
    });
  } else {
    comments = await prisma.reviewComment.findMany({
      where: {
        reviewId: reviewId,
        authorId: {
          not: userId,
        },
      },
      orderBy: {
        totalLikes: "desc",
      },
      include: {
        author: true,
      },
      skip: skipAmount,
      take: 10,
    });
  }

  return comments;
}

export async function isRatioedFunc(revId, totalLikes) {
  const reviewId = parseInt(revId);
  const likes = parseInt(totalLikes);

  const comment = await prisma.reviewComment.findMany({
    where: {
      reviewId: reviewId,
      isRatio: true,
    },
    orderBy: {
      totalLikes: "desc",
    },
    include: {
      author: true,
    },
    take: 1,
  });

  return comment[0]?.totalLikes > likes;
}
