import React from "react";
import Image from "next/image";
import prisma from "@/db";
import ProfilePicture from "./ProfilePicture";
import Link from "next/link";

async function List({ list }) {
  const user = await prisma.user.findUnique({
    where: {
      id: list.authorId,
    },
    select: {
      username: true,
      image: true,
      border: true,
    },
  });
  const games = list.gamesList.map((list) => {
    return JSON.parse(list);
  });
  return (
    <div className="bg-slate-700 bg-opacity-60 p-4 rounded-md mt-7  min-h-[150px]">
      <div className="flex">
        <div className="relative w-1/3">
          <Link href={`/list/${list.id}`}>
            {games.slice(0, 5).map((game, index) => (
              <div
                className="absolute"
                style={{
                  left: `${((index * 1) / 6) * 100}%`,
                  zIndex: `${6 - index}`,
                }}
                key={index}
              >
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.image_id}.jpg`}
                  width={82} // Adjust the width to fit the container
                  height={140} // Adjust the height to fit the container
                  alt={game.name}
                />
              </div>
            ))}
          </Link>
        </div>
        <div className="w-2/3 pl-4">
          <Link href={`/list/${list.id}`}>
            <h2 className="text-xl font-bold mb-2  cursor-pointer hover:underline">
              {list.name}
            </h2>
          </Link>
          <div className="flex flex-row items-center">
            <Link href={`/u/${user.username}`}>
              <div className="flex items-center">
                <ProfilePicture
                  image={user.image}
                  border={user.border}
                  width={30}
                  height={30}
                />
                <p className="text-sm text-gray-300 ml-2">{user.username}</p>
              </div>
            </Link>
          </div>

          <p className="text-sm text-gray-300">{games.length} games</p>
          <p className="mt-2">{list.description}</p>
        </div>
      </div>
    </div>
  );
}

export default List;
