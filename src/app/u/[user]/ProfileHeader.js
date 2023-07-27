import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";
import FavGamesList from "./FavGamesList";
import FollowButton from "./FollowButton";
import { VscLocation } from "react-icons/vsc";
import Link from "next/link";

async function ProfileHeader({ user }) {
  const username = user;

  const userWithProfile = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      image: true, // select the image field from user
      profile: {
        select: {
          reviewCount: true,
          playList: true,
          location: true,
          bio: true,
        },
      },
      id: true,
      following: {
        select: {
          followingId: true,
        },
      },
      followedBy: {
        select: {
          followerId: true,
        },
      },
    },
  });
  if (!userWithProfile) {
    return null;
  }

  const currentUser = await getServerSession(authOptions);
  let alreadyFollow;
  if (currentUser) {
    alreadyFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.user.id,
          followingId: userWithProfile.id,
        },
      },
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row  justify-evenly">
        <div className="flex flex-row  ">
          <div className="flex flex-col items-center">
            <div style={{ width: 164, height: 164, overflow: "hidden" }}>
              <Image
                height={164}
                width={164}
                style={{ borderRadius: "5%" }}
                src={userWithProfile.image}
              />
              <img
                src={"/Vg7.gif"}
                alt="border"
                style={{
                  position: "absolute",
                  // top: "0",
                  // left: "0",
                  width: "164px",
                  height: "164px",
                  transform: "translateY(-164px)",

                  borderRadius: "5%", // or you could use a percentage like "10%"
                }}
              />
            </div>

            {currentUser ? (
              <>
                {currentUser?.user?.id == userWithProfile.id ? (
                  <Link href={"/profile/editprofile"}>
                    <div className=" text-lg mt-4 text-center border rounded-lg py-2 cursor-pointer bg-slate-600 bg-opacity-40 hover:bg-slate-950 px-4 mb-5">
                      Edit Profile
                    </div>
                  </Link>
                ) : (
                  <FollowButton
                    userId={currentUser?.user?.id}
                    otherId={userWithProfile.id}
                    alreadyFollow={alreadyFollow}
                  />
                )}
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col ml-6" style={{ maxWidth: "400px" }}>
            {" "}
            {/* Add maxWidth here */}
            <h1 className="text-4xl ">{username}</h1>
            <div className="flex flex-row mt-3 items-center">
              {!userWithProfile?.profile?.location ? null : (
                <>
                  <VscLocation />
                  <p className=" text-gray-400 font-bold">
                    {userWithProfile?.profile?.location}
                  </p>
                </>
              )}
            </div>
            {userWithProfile?.profile?.bio?.length < 120 ? (
              <p className=" text-lg mt-3">{userWithProfile?.profile?.bio}</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-row mt-8">
          <div className="w-1/4  mr-1 text-center flex flex-col cursor-pointer ">
            <div className=" px-5 border-r-2">
              <Link href={`/u/${username}/games`}>
                <p className="text-2xl font-bold">
                  {userWithProfile.profile.reviewCount}
                </p>
                <p className="text-gray-500">Games</p>
              </Link>
            </div>
          </div>
          <div className="w-1/4 mr-2 text-center flex flex-col ">
            <div className=" px-5 border-r-2">
              <Link href={`/u/${username}/playlist`}>
                <p className="text-2xl font-bold">
                  {userWithProfile.profile.playList.length}
                </p>
                <p className="text-gray-500">Playlisted</p>
              </Link>
            </div>
          </div>
          <div className="w-1/4  mr-1 text-center flex flex-col ">
            <div className=" px-5 border-r-2">
              <Link href={`/u/${username}/following`}>
                <p className="text-2xl font-bold">
                  {userWithProfile.followedBy.length}
                </p>
                <p className="text-gray-500">Following</p>
              </Link>
            </div>
          </div>
          <div className="w-1/4 mr-1  text-center flex flex-col ">
            <div className=" px-5 ">
              <Link href={`/u/${username}/followers`}>
                <p className="text-2xl font-bold">
                  {userWithProfile.following.length}
                </p>
                <p className="text-gray-500">Followers</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
