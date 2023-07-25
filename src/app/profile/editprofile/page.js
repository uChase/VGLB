import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";
import ProfilePicSelector from "./ProfilePicSelector";
import { redirect } from "next/navigation";
import EnterBio from "./EnterBio";
import ChooseFavoriteGames from "./ChooseFavoriteGames";
import prisma from "@/db";

async function page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }
  const favGames = await prisma.profile.findUnique({
    where: { userId: session?.user?.id },
    select: { favGames: true, bio: true, location: true },
  });

  return (
    <div>
      <div className="container mx-auto px-4 w-full">
        <div className="flex flex-col items-center justify-center pb-4 ">
          <h1 className="text-center text-4xl mt-1 p-2  border-b-2 w-1/2 mb-5">
            Edit Profile
          </h1>

          <ProfilePicSelector realSession={session} />

          <h2 className="mb-2 text-gray-500 font-bold ">
            Choose Your Favorite Games
          </h2>
          <ChooseFavoriteGames
            userId={session?.user?.id}
            favGames={favGames.favGames}
          />
          <EnterBio
            session={session}
            bio={favGames?.bio}
            loc={favGames?.location}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
