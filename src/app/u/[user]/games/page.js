import prisma from "@/db";
import { getGamesByIds } from "@/utils/getGameById";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Star from "../Star";
import SortingButtons from "./SortingButtons";

async function getReviews(username, skip = 0, sort = "", rating = "All") {
  const reviews = await prisma.user.findUnique({
    where: {
      username: username,
    },

    include: {
      reviews: {
        where: rating !== "All" ? { Stars: Number(rating) } : {},
        orderBy:
          sort === "Highest"
            ? { Stars: "desc" }
            : sort === "Lowest"
            ? { Stars: "asc" }
            : { createdAt: "desc" },
        take: 48,
        skip: skip,
        select: {
          gameId: true,
          Stars: true,
        },
      },
    },
  });
  if (!reviews) {
    return false;
  }
  const count = await prisma.review.count({
    where: {
      authorId: reviews.id,
    },
  });
  const revArr = reviews.reviews.map((val) => {
    return val.gameId;
  });
  const starArr = reviews.reviews.map((val) => {
    return { stars: val.Stars, id: val.gameId };
  });
  return { revArr, starArr, count };
}

async function page({ params, searchParams }) {
  console.log(searchParams);
  if (!searchParams?.rating) {
    searchParams.rating = "All";
  }
  const pageNumber = searchParams?.page ? searchParams.page : 1;
  const { revArr, starArr, count } = await getReviews(
    params.user,
    (parseInt(pageNumber) - 1) * 48,
    searchParams?.sort,
    searchParams?.rating
  );
  if (!revArr) {
    return "User does not exist";
  }
  const games = await getGamesByIds(revArr);
  const sortedGameStars = starArr.map((id) => {
    const game = games.find((game) => game.id == id.id);
    game.Stars = id.stars;
    return game;
  });
  if (searchParams?.sort == "Highest") {
    sortedGameStars.sort((a, b) => b.Stars - a.Stars);
  } else if (searchParams?.sort == "Lowest") {
    sortedGameStars.sort((a, b) => a.Stars - b.Stars);
  }

  return (
    <div className="  ">
      <div className="flex flex-col items-center justify-between pb-4 ">
        <div className="flex flex-row w-full justify-evenly">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
              <h2 className=" text-slate-300 text-lg">All Games </h2>
              <SortingButtons
                slug={params?.user}
                rate={searchParams?.rating ? searchParams?.rating : "All"}
                sort={searchParams?.sort ? searchParams?.sort : "Recent"}
              />
            </div>
            <div className="grid grid-cols-8 gap-5 ">
              {" "}
              {sortedGameStars.map((game, index) => {
                const stars = Math.floor(game.Stars);
                if (stars == -1) {
                  return null;
                }
                const halfStar = game.Stars % 1 !== 0;
                return (
                  <div
                    key={game.id}
                    className="relative group border-2 border-slate-500 rounded-md overflow-hidden hover:border-slate-400 cursor-pointer"
                  >
                    <Link href={`/games/${game.slug}`}>
                      <Image
                        src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.image_id}.jpg`}
                        width={94}
                        height={182}
                        className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center transition-all duration-200">
                        <p className="text-slate-100  text-center text-xs">
                          {game?.name}
                        </p>
                        <div className="text-slate-100  text-center text-xs">
                          <div className="flex flex-row  items-center">
                            {[...Array(stars)].map((e, i) => (
                              <Star key={i} />
                            ))}
                            {halfStar ? <>½</> : null}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
            <Pagination
              itemsPerPage={48}
              totalItems={count}
              user={params.user}
              sort={searchParams?.sort}
              rate={searchParams?.rating}
            />
          </div>
          <div className=" flex flex-col items-center">
            <div className="flex flex-col bg-slate-950 rounded-lg p-4 w-64 mt-2">
              <Link href={`/u/${params.user}`}>
                <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
                  Home
                </div>
              </Link>
              <div className="text-blue-500 hover:bg-slate-900 py-2 px-4 text-lg rounded font-bold cursor-pointer">
                Games
              </div>
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
      </div>
    </div>
  );
}

export default page;

function Pagination({ itemsPerPage, totalItems, user, sort, rate }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className=" w-full flex flex-row justify-center">
      <ul className="pagination flex flex-row gap-5">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <Link
              href={`/u/${user}/games?page=${number}&sort=${sort}&rating=${rate}`}
            >
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
