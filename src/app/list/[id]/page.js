import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProfilePicture from "@/components/ProfilePicture";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CreatorOptions from "./creatorOptions";
import Thumbs from "./thumbs";

async function page({ params }) {
  const list = await prisma.list.findUnique({
    where: {
      id: parseInt(params.id),
    },
    select: {
      id: true,
      name: true,
      description: true,
      gamesList: true,
      isOrdered: true,
      likes: true,
      dislikes: true,
      authorId: true,
      author: {
        select: {
          username: true,
          image: true,
          border: true,
        },
      },
    },
  });
  const games = list.gamesList.map((list) => {
    return JSON.parse(list);
  });
  const session = await getServerSession(authOptions);

  return (
    <div className="  ">
      <div className="flex flex-col items-center justify-between pb-4 ">
        <div className="flex flex-row w-full justify-evenly">
          <div className="flex flex-col w-1/2">
            <div className=" mb-4 border-b border-slate-300 py-2 ">
              <div className=" text-4xl font-bold mb-4">{list.name}</div>
              <div>
                <div className="flex flex-row items-center">
                  <Link href={`/u/${list.author.username}`}>
                    <div className="flex items-center border p-2 mb-3 rounded-xl hover:bg-slate-700 hover:bg-opacity-50">
                      <ProfilePicture
                        image={list.author.image}
                        border={list.author.border}
                        width={60}
                        height={60}
                      />
                      <p className="text-xl text-gray-300 ml-2">
                        {list.author.username}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
              {session?.user?.id == list.authorId ? (
                <CreatorOptions list={list} />
              ) : null}
              <div className=" text-slate-400 text-xl">
                {list.gamesList.length} Games
              </div>
              <div className=" flex flex-row justify-between ">
                <div className=" text-slate-300 text-2xl">
                  {list.description}
                </div>
                <Thumbs list={list} userId={session?.user?.id} />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-5">
              {games.map((game, index) => {
                return (
                  <div className="flex flex-col items-center">
                    <Link href={`/games/${game.slug}`}>
                      <div
                        key={game.id}
                        className="relative group border-2 border-slate-500 rounded-md overflow-hidden hover:border-slate-400 cursor-pointer"
                      >
                        <Image
                          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.image_id}.jpg`}
                          width={264}
                          height={352}
                          className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
                          <p className="text-slate-100  text-center">
                            {game.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                    {list.isOrdered ? (
                      <div className="mt-1 "> {index + 1}</div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
