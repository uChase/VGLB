"use server";

import prisma from "@/db";

export default async function getFollowing(userId) {
  const following = await prisma.follows.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });

  return following.map((follow) => follow.followingId);
}
