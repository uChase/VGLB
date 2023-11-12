import { getGamesByIds } from "@/utils/getGameById";
import getIsLiked from "@/utils/getIsLiked";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import Image from "next/image";
import GameHomePageReview from "@/components/GameHomePageReview";

async function getPopularReviews(userId) {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        likesCount: "desc",
      },
      take: 50,
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
    console.log(reviews);

    for (let i = 0; i < reviews.length; i++) {
      if (userId) {
        const liked = await getIsLiked(reviews[i].id, userId);
        reviews[i].liked = liked;
      }
    }

    let gameIds = extractGameIds(reviews);
    gameIds = gameIds.filter((item) => item !== undefined);

    const gameDatas = await getGamesByIds(gameIds);
    const sortedGameDatas = gameIds.map((id) =>
      gameDatas.find((game) => game?.id == id)
    );

    for (let i = 0; i < reviews.length; i++) {
      reviews[i].slug = sortedGameDatas[i]?.slug;
      reviews[i].name = sortedGameDatas[i]?.name;
      reviews[i].cover = sortedGameDatas[i]?.cover?.image_id;
    }

    return reviews;
  } catch {}
}
function extractGameIds(reviews) {
  // Map through the reviews and return the gameId of each
  return reviews
    .map((review) => review?.game?.gameId)
    .filter((gameId) => gameId !== undefined);
}

async function page({ params, searchParams }) {
  const session = await getServerSession(authOptions);
  // let page = 1;
  // if (searchParams?.page) {
  //   page = searchParams.page;
  // }
  const reviews = await getPopularReviews(session?.user?.id);

  return (
    <div className=" flex flex-row justify-evenly ">
      <div className="w-1/2">
        <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
          <h2 className=" text-slate-300 text-lg">All Reviews </h2>
        </div>
        {reviews.map((rev) => (
          <div className=" min-w-[400px]" key={rev?.id}>
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
                  isAuthor={session?.user?.id == rev.authorId}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
