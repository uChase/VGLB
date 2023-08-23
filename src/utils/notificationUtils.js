"use server";

import prisma from "@/db";
import { NotifType, PostType } from "@prisma/client";

export async function sendNotification(
  authorId,
  sender,
  notifType,
  postType,
  textId = false,
  revId = false
) {
  switch (notifType) {
    case NotifType.FOLLOW:
      {
        const createNotif = await prisma.Notification.create({
          data: {
            userId: authorId,
            sender: sender,
            type: notifType,
          },
        });
      }
      break;
    default: {
      switch (postType) {
        case PostType.REVIEW:
          {
            const createNotif = await prisma.Notification.create({
              data: {
                userId: authorId,
                sender: sender,
                type: notifType,
                postType: postType,
                revId: textId,
              },
            });
          }
          break;
        case PostType.COMMENT:
          {
            const createNotif = await prisma.Notification.create({
              data: {
                userId: authorId,
                sender: sender,
                type: notifType,
                postType: postType,
                revCommentId: textId,
              },
            });
          }
          break;
        case PostType.REPLY: {
          {
            const createNotif = await prisma.Notification.create({
              data: {
                userId: authorId,
                sender: sender,
                type: notifType,
                postType: postType,
                revCommentId: textId,
              },
            });
          }
          break;
        }
      }
    }
  }
}

export async function getNotifications(userId) {
  const notifications = await prisma.notification.findMany({
    where: {
      userId: userId,
      read: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comment: {
        select: {
          review: {
            select: {
              id: true,
              game: true,
            },
          },
        },
      },
      review: {
        select: {
          id: true,
          game: true,
        },
      },
      list: true,
      reply: true,
    },
    take: 10,
  });
  return notifications;
}

export async function deleteNotification(id) {
  const deleted = await prisma.notification.delete({
    where: {
      id: id,
    },
  });
}

export async function deleteManyNotifications(userId) {
  const deleted = await prisma.notification.deleteMany({
    where: {
      userId: userId,
    },
  });
}
