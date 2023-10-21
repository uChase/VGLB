import ProfilePicture from "@/components/ProfilePicture";
import prisma from "@/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function getUser(username, skip = 0) {
  const userWithProfile = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,

      followedBy: {
        skip: skip,
        take: 48,
        select: {
          following: {
            select: {
              username: true,
              image: true,
              id: true,
              border: true,
            },
          },
        },
      },
    },
  });
  if (!userWithProfile) {
    return false;
  }
  const count = await prisma.follows.count({
    where: {
      followerId: userWithProfile?.id,
    },
  });
  return { userWithProfile, count };
}

async function page({ params, searchParams }) {
  const username = params.user;
  let page = searchParams?.page;
  if (!page) {
    page = 1;
  }
  const { count, userWithProfile } = await getUser(username, (page - 1) * 48);
  //note data org is messed up, followedBy is actually the people who the profile is following, ik fucked, ai fucked it up

  if (!userWithProfile) {
    return "no such user";
  }

  return (
    <div className="  ">
      <div className="flex flex-col items-center justify-between pb-4 ">
        <div className="flex flex-row w-full justify-evenly">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
              <h2 className=" text-slate-300 text-lg">Following </h2>
            </div>
            <div className="grid grid-cols-8 gap-5 ">
              {userWithProfile.followedBy.map((user) => {
                return (
                  <div
                    className="border-2 border-slate-50 p-2 rounded-md  mr-2 bg-slate-600 hover:bg-slate-800 bg-opacity-60"
                    key={user.id}
                  >
                    <div className="flex items-center justify-center">
                      <div>
                        <Link href={`/u/${user?.following?.username}`}>
                          <div className=" cursor-pointer inline-flex flex-col justify-center items-center">
                            <ProfilePicture
                              image={user?.following?.image}
                              width={75}
                              height={75}
                              border={user?.following?.border}
                            />
                            <p className=" align-middle text-lg font-semibold">
                              {user?.following?.username}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination itemsPerPage={48} totalItems={count} user={username} />
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
              <div className="text-blue-500 hover:bg-slate-900 py-2 px-4 text-lg rounded font-bold cursor-pointer">
                Following
              </div>
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

function Pagination({ itemsPerPage, totalItems, user }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className=" w-full flex flex-row justify-center">
      <ul className="pagination flex flex-row gap-5">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <Link href={`/u/${user}/following?page=${number}`}>
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
