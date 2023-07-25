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
    return "user does not exist";
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
              <Image height={164} width={164} src={userWithProfile.image} />
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
          <div className="w-1/4  mr-1 text-center flex flex-col ">
            <div className=" px-5 border-r-2">
              <p className="text-2xl font-bold">
                {userWithProfile.profile.reviewCount}
              </p>
              <p className="text-gray-500">Games</p>
            </div>
          </div>
          <div className="w-1/4 mr-2 text-center flex flex-col ">
            <div className=" px-5 border-r-2">
              <p className="text-2xl font-bold">
                {userWithProfile.profile.playList.length}
              </p>
              <p className="text-gray-500">Playlisted</p>
            </div>
          </div>
          <div className="w-1/4  mr-1 text-center flex flex-col ">
            <div className=" px-5 border-r-2">
              <p className="text-2xl font-bold">
                {userWithProfile.followedBy.length}
              </p>
              <p className="text-gray-500">Followers</p>
            </div>
          </div>
          <div className="w-1/4 mr-1  text-center flex flex-col ">
            <div className=" px-5 ">
              <p className="text-2xl font-bold">
                {userWithProfile.following.length}
              </p>
              <p className="text-gray-500">Following</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
