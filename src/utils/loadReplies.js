"use server";

import prisma from "@/db";

export async function addReply(authorId, commentId, content) {
  const newReply = await prisma.replys.create({
    data: {
      authorId: authorId,
      reviewCommentId: commentId,
      content: content,
    },
    include: {
      author: true,
    },
  });

  return newReply;
}

export default async function loadReplies(
  userId,
  commentId,
  takeAmount,
  skip = 0,
  recentSwitch = "asc"
) {
  const replies = await prisma.replys.findMany({
    where: {
      reviewCommentId: commentId,
      authorId: {
        not: userId,
      },
    },
    orderBy: {
      createdAt: recentSwitch,
    },
    skip: parseInt(skip),
    take: parseInt(takeAmount),
    include: {
      author: true,
    },
  });

  return replies;
}

export async function loadUserReplies(
  userId,
  commentId,
  takeAmount = -1,
  skip = 0,
  recentSwitch = "asc"
) {
  const query = {
    where: {
      authorId: userId,
      reviewCommentId: commentId,
    },
    orderBy: {
      createdAt: recentSwitch,
    },
    skip: parseInt(skip),
    include: {
      author: true,
    },
  };
  if (takeAmount != -1) {
    query.take = parseInt(takeAmount);
  }

  const userReplies = await prisma.replys.findMany(query);

  return userReplies;
}
