import GameBar from "@/components/GameBar";
import React from "react";
import FavGamesList from "./FavGamesList";
import RecentReviewsList from "./RecentReviewsList";
import Link from "next/link";
import getGameDbData from "@/utils/getGameDbData";
import getUserById from "@/utils/getUserById";
import prisma from "@/db";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getIsLiked from "@/utils/getIsLiked";
import GameHomePageReview from "@/components/GameHomePageReview";
import { getGamesByIds } from "@/utils/getGameById";
import Image from "next/image";

async function getPopularReviews(author, userId) {
  const reviews = await prisma.review.findMany({
    where: {
      authorId: author,
    },
    orderBy: {
      likesCount: "desc",
    },
    take: 3,
    include: {
      author: {
        select: {
          id: true,
          image: true,
          username: true,
          border: true,
        },
      },
      game: {
        select: {
          gameId: true,
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
    },
  });
  for (let i = 0; i < reviews.length; i++) {
    if (userId) {
      const liked = await getIsLiked(reviews[i].id, userId);
      reviews[i].liked = liked;
    }
  }

  let gameIds = [
    reviews[0]?.game?.gameId,
    reviews[1]?.game?.gameId,
    reviews[2]?.game?.gameId,
  ];
  gameIds = gameIds.filter((item) => item !== undefined);

  const gameDatas = await getGamesByIds(gameIds);
  const sortedGameDatas = gameIds.map((id) =>
    gameDatas.find((game) => game?.id == id)
  );

  for (let i = 0; i < reviews.length; i++) {
    reviews[i].slug = sortedGameDatas[i]?.slug;
    reviews[i].name = sortedGameDatas[i]?.name;
    reviews[i].cover = sortedGameDatas[i]?.cover.image_id;
  }

  return reviews;
}

async function page({ params }) {
  const session = await getServerSession(authOptions);
  const userWithProfile = await prisma.user.findUnique({
    where: {
      username: params.user,
    },
    select: {
      image: true, // select the image field from user
      profile: true,
      id: true,
    },
  });
  if (!userWithProfile) {
    return "user does not exist";
  }
  const reviews = await getPopularReviews(
    userWithProfile.id,
    session?.user?.id
  );

  console.log(session?.user?.id == userWithProfile.id);

  const barHeights = userWithProfile.profile.reviewSpread
    .slice(0, 10)
    .map((count) => {
      if (userWithProfile.profile.reviewCount == 0) {
        return 0;
      }
      return (count / userWithProfile.profile.reviewCount) * 100;
    });

  return (
    <div className=" flex flex-row justify-evenly ">
      <div className="w-1/2">
        <FavGamesList favGames={userWithProfile.profile.favGames} />
        <RecentReviewsList user={userWithProfile.id} />
        <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
          <h2 className=" text-slate-300 text-lg">Popular Reviews </h2>
          <Link href={`/u/${params.user}/reviews`}>
            <h3 className="text-slate-300 cursor-pointer text-sm hover:text-slate-500">
              See All
            </h3>
          </Link>
        </div>
        {reviews.map((rev) => (
          <>
            <h1 className="text-slate-300 text-lg flex flex-row mb-2  justify-center">
              Review For{" "}
              <Link href={`/games/${rev.slug}`}>
                <p className="ml-2 text-blue-500 hover:text-blue-900  font-bold cursor-pointer">
                  {rev.name}
                </p>
              </Link>
            </h1>
            <div className=" flex flex-row justify-between items-center mb-3">
              <div className="">
                <Link href={`/games/${rev?.slug}`}>
                  <div
                    key={rev.id}
                    className={`relative group border-2 mx-1 rounded-md overflow-hidden cursor-pointer `}
                  >
                    <Image
                      src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${rev?.cover}.jpg`}
                      width={134}
                      height={222}
                      className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
                      <p className="text-slate-100 text-center">{rev.name}</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="w-3/4">
                <GameHomePageReview
                  review={rev}
                  user={session?.user}
                  game={rev.slug}
                  isAuthor={session?.user?.id == userWithProfile.id}
                />
              </div>
            </div>
          </>
        ))}
      </div>
      <div className=" flex flex-col items-center">
        <div className="flex flex-col bg-slate-950 rounded-lg p-4 w-64 mt-2">
          <div className="text-blue-500 hover:bg-slate-900 py-2 px-4 text-lg rounded font-bold cursor-pointer">
            Home
          </div>
          <Link href={`/u/${params.user}/games`}>
            <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
              Games
            </div>
          </Link>
          <Link href={`/u/${params.user}/reviews`}>
            <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
              Reviews
            </div>
          </Link>
          <Link href={`/u/${params.user}/playlist`}>
            <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
              PlayList
            </div>
          </Link>
          <Link href={`/u/${params.user}/list`}>
            <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
              Lists
            </div>
          </Link>
          <Link href={`/u/${params.user}/followers`}>
            <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
              Followers
            </div>
          </Link>
          <Link href={`/u/${params.user}/following`}>
            <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
              Following
            </div>
          </Link>
          <div className="text-white hover:bg-slate-900 py-2 px-4 rounded  text-lg cursor-pointer">
            Currently Playing
          </div>
        </div>
        <div className=" w-3/4 mt-3">
          <GameBar
            barHeights={barHeights}
            spread={userWithProfile.profile.reviewSpread}
            isProfile={true}
            slug={params.user}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
