"use server";

import prisma from "@/db";
import { Opinion } from "@prisma/client";

export async function getThumbsList(listId, userId) {
  const current = await prisma.listOpinion.upsert({
    where: {
      userId_listId: {
        userId: userId,
        listId: listId,
      },
    },
    update: {},
    create: {
      userId: userId,
      listId: listId,
      opinion: Opinion.NONE,
    },
  });

  return current.opinion;
}

export async function thumbsUpList(listId, userId) {
  const current = await prisma.listOpinion.upsert({
    where: {
      userId_listId: {
        userId: userId,
        listId: listId,
      },
    },
    update: {},
    create: {
      userId: userId,
      listId: listId,
      opinion: Opinion.NONE,
    },
  });

  if (current.opinion == Opinion.LIKE) {
    return "already liked";
  }
  if (current.opinion == Opinion.NONE) {
    await prisma.listOpinion.update({
      where: {
        userId_listId: {
          userId: userId,
          listId: listId,
        },
      },
      data: {
        opinion: Opinion.LIKE,
      },
    });
    await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
    return "liked!";
  }
  if (current.opinion == Opinion.DISLIKE) {
    await prisma.listOpinion.update({
      where: {
        userId_listId: {
          userId: userId,
          listId: listId,
        },
      },
      data: {
        opinion: Opinion.LIKE,
      },
    });
    await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        likes: {
          increment: 1,
        },
        dislikes: {
          decrement: 1,
        },
      },
    });
    return "liked!";
  }
  return "failed";
}

export async function thumbsDownList(listId, userId) {
  const current = await prisma.listOpinion.upsert({
    where: {
      userId_listId: {
        userId: userId,
        listId: listId,
      },
    },
    update: {},
    create: {
      userId: userId,
      listId: listId,
      opinion: Opinion.NONE,
    },
  });

  if (current.opinion == Opinion.DISLIKE) {
    return "already disliked";
  }
  if (current.opinion == Opinion.NONE) {
    await prisma.listOpinion.update({
      where: {
        userId_listId: {
          userId: userId,
          listId: listId,
        },
      },
      data: {
        opinion: Opinion.DISLIKE,
      },
    });
    await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        dislikes: {
          increment: 1,
        },
      },
    });
    return "disliked!";
  }
  if (current.opinion == Opinion.LIKE) {
    await prisma.listOpinion.update({
      where: {
        userId_listId: {
          userId: userId,
          listId: listId,
        },
      },
      data: {
        opinion: Opinion.DISLIKE,
      },
    });
    await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        dislikes: {
          increment: 1,
        },
        likes: {
          decrement: 1,
        },
      },
    });
    return "disliked!";
  }
  return "failed";
}
