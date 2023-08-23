import prisma from "@/db";
import { getGamesByIds } from "@/utils/getGameById";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NewListButton from "./NewListButton";
import List from "@/components/List";

async function page({ params }) {
  const profile = await prisma.user.findUnique({
    where: {
      username: params.user,
    },
    select: {
      List: true,
      id: true,
    },
  });
  if (!profile) {
    return " no user";
  }

  return (
    <div className="  ">
      <div className="flex flex-col items-center justify-between pb-4 ">
        <div className="flex flex-row w-full justify-evenly">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-1 items-center">
              <h2 className=" text-slate-300 text-lg mr-4">Lists </h2>
              <NewListButton userId={profile?.id} />
            </div>
            <div className="flex flex-col">
              {profile.List.map((list) => {
                return <List list={list} user={params.user} />;
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
              <Link href={`/u/${params.user}/playlist`}>
                <div className="text-white hover:bg-slate-900 py-2 px-4 rounded text-lg cursor-pointer">
                  PlayList
                </div>
              </Link>
              <div className="text-blue-500 hover:bg-slate-900 py-2 px-4 text-lg rounded font-bold cursor-pointer">
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
