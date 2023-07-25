"use server";

import prisma from "@/db";

export default async function addComment(userId, reviewId, content, ratio) {
  const comment = await prisma.reviewComment.create({
    data: {
      author: {
        connect: {
          id: userId,
        },
      },
      review: {
        connect: {
          id: reviewId,
        },
      },
      content: content,
      isRatio: ratio,
    },
  });
  return comment;
}
