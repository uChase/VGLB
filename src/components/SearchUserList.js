"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function SearchUserList({ data, searchInput }) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center pb-4 ">
        <h1 className="text-4xl mt-4 mb-2">Searching "{searchInput}"</h1>
        <h3 className="text-2xl  mb-2">{data?.length} Results</h3>
        <div className="flex gap-4 mb-4 text-lg">
          <p
            className=" underline cursor-pointer hover:text-slate-500"
            onClick={() => {
              router.push(`/search/games/${searchInput}`);
            }}
          >
            Games
          </p>
          <p className="text-blue-500 underline cursor-default">Users</p>
          <p
            className=" underline cursor-pointer hover:text-slate-500"
            onClick={() => {
              router.push(`/search/lists/${searchInput}`);
            }}
          >
            Lists
          </p>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-5">
        {data.map((user, index) => {
          return (
            <div
              className=" flex flex-col items-center cursor-pointer border-2 border-slate-50 p-2 rounded-md  mr-2  hover:bg-slate-600 bg-opacity-60"
              onClick={() => {
                router.push(`/u/${user.username}`);
              }}
            >
              <Image src={user.image} width={264} height={352} />
              <p className=" align-middle text-3xl font-semibold">
                {user.username}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchUserList;
