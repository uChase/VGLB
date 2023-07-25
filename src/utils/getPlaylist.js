"use server";

import prisma from "@/db";

export async function getPlaylist(userId) {
  if (!userId) {
    return false;
  }
  const playlist = await prisma.profile.findUnique({
    where: { userId: userId },
    select: { playList: true },
  });

  return playlist?.playList;
}

export async function addToPlaylist(gameId, userId) {
  const playlist = await prisma.profile.findUnique({
    where: { userId: userId },
    select: { playList: true },
  });
  if (playlist?.playList.includes(parseInt(gameId))) {
    return " already added";
  }
  const newArr = playlist?.playList;
  newArr.push(gameId);
  const updated = await prisma.profile.update({
    where: { userId: userId },
    data: {
      playList: newArr,
    },
  });
  return "added";
}

export async function removeFromPlaylist(gameId, userId) {
  const playlist = await prisma.profile.findUnique({
    where: { userId: userId },
    select: { playList: true },
  });
  if (!playlist?.playList.includes(parseInt(gameId))) {
    return " already not in";
  }
  let newArr = playlist?.playList;
  newArr = newArr.filter((item) => item != parseInt(gameId));
  const updated = await prisma.profile.update({
    where: { userId: userId },
    data: {
      playList: newArr,
    },
  });
  return updated;
}
