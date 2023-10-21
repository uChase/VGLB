"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function SearchList({ data, searchInput }) {
  const [loaded, setLoaded] = useState(24);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.documentElement.scrollHeight;

      // Trigger when user is within 200px from the bottom
      const bottomOffset = 200;

      if (windowHeight + scrollTop >= bodyHeight - bottomOffset) {
        setLoaded((loaded) => loaded + 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center pb-4 ">
        <h1 className="text-4xl mt-4 mb-2">
          Searching &quot;{searchInput}&quot;
        </h1>
        <h3 className="text-2xl  mb-2">{data?.length} Results</h3>
        <div className="flex gap-4 mb-4 text-lg">
          <p className="text-blue-500 underline cursor-default">Games</p>
          <p
            className="underline cursor-pointer hover:text-slate-500"
            onClick={() => {
              router.push(`/search/users/${searchInput}`);
            }}
          >
            Users
          </p>
          <p
            className="underline cursor-pointer hover:text-slate-500"
            onClick={() => {
              router.push(`/search/lists/${searchInput}`);
            }}
          >
            Lists
          </p>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-5">
        {data?.slice(0, loaded).map((game, index) => {
          return (
            <div
              key={game.id}
              className="relative group border-2 border-slate-500 rounded-md overflow-hidden hover:border-slate-400 cursor-pointer"
              onClick={() => {
                router.push(`/games/${game.slug}`);
              }}
            >
              <Image
                src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.image_id}.jpg`}
                width={264}
                height={352}
                className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
              />
              <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
                <p className="text-slate-100  text-center">{game.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchList;
