import prisma from "@/db";
import { getGameById, getGamesByIds } from "@/utils/getGameById";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Star from "./Star";

async function getReviews(userId) {
  const reviews = await prisma.review.findMany({
    where: {
      authorId: userId, // Assuming the user id is referenced as authorId in the Review model
    },
    orderBy: {
      createdAt: "desc", // Assuming the creation date is stored as createdAt in the Review model
    },
    select: {
      gameId: true,
      Stars: true,
      id: true,
    },
    take: 5,
  });
  return reviews;
}

async function RecentReviewsList({ user }) {
  const reviews = await getReviews(user);
  const gamers = [];

  for (let rev of reviews) {
    gamers.push(rev.gameId);
  }

  const games = await getGamesByIds(gamers);

  return (
    <div className="flex flex-col mt-3">
      <div className="mb-6 border-b border-slate-500 py-1 ">
        <h1 className="text-slate-300 text-lg ">Recent Reviews</h1>
      </div>
      <div className="flex flex-row">
        {games.map((game, index) => {
          const stars = Math.floor(reviews[index].Stars);
          const halfStar = reviews[index].Stars % 1 !== 0;
          return (
            <Link href={`/games/${game?.slug}/review/${reviews[index]?.id}`}>
              <div
                key={game?.id}
                className={`relative group border-2 mx-1 border-slate-500 hover:border-slate-400 rounded-md overflow-hidden cursor-pointer `}
              >
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.image_id}.jpg`}
                  width={164}
                  height={252}
                  className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
                />
                <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
                  <p className="text-slate-100 text-center">{game?.name}</p>
                </div>
              </div>
              <div className="flex flex-row  items-center">
                {" "}
                {[...Array(stars)].map((e, i) => (
                  <Star key={i} />
                ))}
                {halfStar ? <>½</> : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RecentReviewsList;
