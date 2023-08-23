"use server";

import prisma from "@/db";
import { sendNotification } from "./notificationUtils";
import { NotifType } from "@prisma/client";

export default async function followAsync(userId, otherId, currentUsername) {
  const newFollow = await prisma.follows.create({
    data: {
      followerId: userId,
      followingId: otherId,
    },
  });
  await sendNotification(otherId, currentUsername, NotifType.FOLLOW);
  return newFollow;
}

export async function unFollowAsync(followerId, followingId) {
  try {
    const result = await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    console.log(`Unfollowed successfully.`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
