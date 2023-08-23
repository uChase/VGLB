"use server";

import prisma from "@/db";
import { getGameBySlugListVersion } from "./getGameBySlug";

function stringifyArray(array) {
  return array.map((item) => JSON.stringify(item));
}

export async function createList(name, userId, description, isOrdered, games) {
  let gamesList = stringifyArray(games);

  const list = await prisma.list.create({
    data: {
      author: {
        connect: {
          id: userId,
        },
      },
      name: name,
      description: description,
      gamesList: gamesList,
      isOrdered: isOrdered,
    },
  });
}
export async function updateList(name, description, isOrdered, games, listId) {
  let gamesList = stringifyArray(games);

  const list = await prisma.list.update({
    where: {
      id: listId,
    },
    data: {
      name: name,
      description: description,
      gamesList: gamesList,
      isOrdered: isOrdered,
    },
  });
}

export async function deleteList(listId) {
  await prisma.list.delete({
    where: { id: listId },
  });
}

export async function getLists(userId) {
  const lists = await prisma.list.findMany({
    where: {
      authorId: userId,
    },
  });
  return lists;
}

export async function addGameToList(slug, listId) {
  console.log(listId);
  const game = await getGameBySlugListVersion(slug);
  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
  });
  let games = list.gamesList;
  const newGame = JSON.stringify(game[0]);

  const isDuplicate = games.some((existingGame) => existingGame === newGame);

  if (!isDuplicate) {
    games.push(newGame);
  }

  const submit = await prisma.list.update({
    where: {
      id: listId,
    },
    data: {
      gamesList: games,
    },
  });
}

export async function getListAuthor(authorId) {
  const user = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
    select: {
      username: true,
      image: true,
      border: true,
    },
  });
  return user;
}
