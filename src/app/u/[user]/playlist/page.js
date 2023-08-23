import prisma from "@/db";
import { getGamesByIds } from "@/utils/getGameById";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function page({ params }) {
  const profile = await prisma.user.findUnique({
    where: {
      username: params.user,
    },
    select: {
      profile: {
        select: { playList: true },
      },
    },
  });
  if (!profile) {
    return " no user";
  }
  const games = await getGamesByIds(profile.profile.playList);

  return (
    <div className="  ">
      <div className="flex flex-col items-center justify-between pb-4 ">
        <div className="flex flex-row w-full justify-evenly">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
              <h2 className=" text-slate-300 text-lg">Listed Games </h2>
            </div>
            <div className="grid grid-cols-6 gap-5 ">
              {games.map((game) => {
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
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
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
              <Link href={`/u/${params.user}/reviews`}>
                <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
                  Reviews
                </div>
              </Link>
              <div className="text-blue-500 hover:bg-slate-900 py-2 px-4 text-lg rounded font-bold cursor-pointer">
                PlayList
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
