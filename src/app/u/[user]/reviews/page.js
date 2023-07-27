import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GameHomePageReview from "@/components/GameHomePageReview";
import { getGamesByIds } from "@/utils/getGameById";
import getIsLiked from "@/utils/getIsLiked";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function getPopularReviews(username, userId, skip = 0, sort = "") {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    return false;
  }
  const count = await prisma.review.count({
    where: {
      authorId: user?.id,
      content: {
        not: null,
        not: "",
      },
    },
  });
  const reviews = await prisma.review.findMany({
    where: {
      authorId: user?.id,
      content: {
        not: null,
        not: "",
      },
    },

    orderBy:
      sort === "Highest"
        ? { likesCount: "desc" }
        : sort === "Lowest"
        ? { likesCount: "asc" }
        : { createdAt: "desc" },

    skip: skip,
    take: 10,
    include: {
      author: {
        select: {
          id: true,
          image: true,
          username: true,
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

  let gameIds = [];

  for (let rev of reviews) {
    gameIds.push(rev?.game?.gameId);
  }

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

  return { reviews, count };
}

async function page({ params, searchParams }) {
  const session = await getServerSession(authOptions);
  let page = 1;
  if (searchParams?.page) {
    page = searchParams.page;
  }
  const { reviews, count } = await getPopularReviews(
    params.user,
    session?.user?.id,
    (page - 1) * 10
  );
  if (!reviews) {
    return "no user";
  }

  return (
    <div className=" flex flex-row justify-evenly ">
      {" "}
      <div className="w-1/2">
        <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
          <h2 className=" text-slate-300 text-lg">All Reviews </h2>
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
                />
              </div>
            </div>
          </>
        ))}
        <Pagination
          itemsPerPage={10}
          totalItems={count}
          user={params.user}
          sort={"Popular"}
        />
      </div>
      <div className=" flex flex-col items-center">
        <div className="flex flex-col bg-slate-950 rounded-lg p-4 w-64 mt-2">
          <Link href={`/u/${params.user}`}>
            <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
              Home
            </div>
          </Link>
          <Link href={`/u/${params.user}/games`}>
            <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
              Games
            </div>
          </Link>
          <div className="text-blue-500 hover:bg-slate-900 py-2 px-4 text-lg rounded font-bold cursor-pointer">
            Reviews
          </div>
          <Link href={`/u/${params.user}/playlist`}>
            <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
              PlayList
            </div>
          </Link>
          <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
            Lists
          </div>
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
      </div>
    </div>
  );
}

export default page;

function Pagination({ itemsPerPage, totalItems, user, sort }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className=" w-full flex flex-row justify-center">
      <ul className="pagination flex flex-row gap-5">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <Link href={`/u/${user}/reviews?page=${number}`}>
              <div className=" font-bold text-xl hover:text-slate-500">
                {number}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
