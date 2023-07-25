import { getGameById, getGamesByIds } from "@/utils/getGameById";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function getGames(favGames) {
  let arr = [];
  for (let i = 0; i < 5; i++) {
    if (favGames[i] != "empty") {
      arr[i] = (await getGameById(parseInt(favGames[i])))[0];
    } else {
      arr[i] = "empty";
    }
  }
  return arr;
}

async function FavGamesList({ favGames }) {
  const gameAr = await getGamesByIds(favGames);

  return (
    <div className="flex flex-col">
      <div className="mb-6 border-b border-slate-500 py-1 ">
        <h1 className="text-slate-300 text-lg ">Favorite Games</h1>
      </div>

      <div className="flex flex-row">
        {(() => {
          const reorderedArray = [
            gameAr[3], // 4th game
            gameAr[1], // 2nd game
            gameAr[0], // 1st game
            gameAr[2], // 3rd game
            gameAr[4], // 5th game
          ];

          return reorderedArray.map((game, index) => {
            if (game == "empty") {
              return null;
            }

            let borderColorClass, positionClass;
            switch (index) {
              case 2:
                borderColorClass = "border-yellow-500 hover:border-yellow-400";
                positionClass = "transform -translate-y-3";
                break;
              case 1:
              case 3:
                borderColorClass = "border-teal-500 hover:border-teal-400";
                break;
              case 0:
              case 4:

              default:
                borderColorClass = "border-slate-500 hover:border-slate-400";
                positionClass = "";
            }

            return (
              <Link href={`/games/${game?.slug}`}>
                <div
                  key={game?.id}
                  className={`relative group border-2 mx-1 ${borderColorClass} rounded-md overflow-hidden cursor-pointer ${positionClass}`}
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
              </Link>
            );
          });
        })()}
      </div>
    </div>
  );
}

export default FavGamesList;
