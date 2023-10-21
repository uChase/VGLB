import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GameHomePageReview from "@/components/GameHomePageReview";
import ReviewLoader from "@/components/ReviewLoader";
import SortButtons from "@/components/SortButtons";
import getGameDbData from "@/utils/getGameDbData";
import getIsLiked from "@/utils/getIsLiked";
import getUserById from "@/utils/getUserById";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;

async function getGame(gameName) {
  const response = await fetch("https://api.igdb.com/v4/games", {
    cache: "force-cache",
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: "Bearer " + accessToken,
      "Content-Type": "text/plain",
    },
    body: `fields name, screenshots.image_id,  artworks.image_id, artworks.height, cover.image_id; where slug = "${gameName}";`,
  });
  const data = await response.json();

  return data;
}

async function getReviewAndUser(
  gameId,
  userId,
  rateSort = "All",
  sort = "Popular"
) {
  const gameReviewData = await getGameDbData(
    gameId,
    15,
    rateSort,
    sort,
    userId
  );
  gameReviewData.reviews.map(async (rev) => {
    const author = await getUserById(rev.authorId);
    rev.author = author;
    return rev;
  });
  for (let i = 0; i < gameReviewData.reviews.length; i++) {
    const author = await getUserById(gameReviewData.reviews[i].authorId);
    gameReviewData.reviews[i].author = author;
    if (userId) {
      const liked = await getIsLiked(gameReviewData.reviews[i].id, userId);
      gameReviewData.reviews[i].liked = liked;
    }
  }
  return gameReviewData;
}

function selectRandomArtwork(artworks, screenshots) {
  if (!artworks) {
    if (!screenshots) {
      return "none";
    }
    const randomIndex = Math.floor(Math.random() * screenshots.length);
    return screenshots[randomIndex].image_id;
  }
  const randomIndex = Math.floor(Math.random() * artworks.length);
  return artworks[randomIndex].image_id;
}

async function page({ params, searchParams }) {
  const session = await getServerSession(authOptions);
  const game = await getGame(params.game);
  const gameReviewData = await getReviewAndUser(
    game[0].id,
    session?.user?.id,
    searchParams?.rating,
    searchParams?.sort
  );

  return (
    <div>
      {" "}
      <div className="fixed top-1 left-0 h-[85vh] w-full z-[-1]">
        {/* maybe size 75% */}
        <div
          className="absolute inset-0  "
          style={{
            backgroundImage: `
      radial-gradient(circle at top left, rgba(30, 41, 59, 1) 0%, rgba(30, 41, 59, 0) 50%, rgba(30, 41, 59, 1) 100%), 
      radial-gradient(circle at top right, rgba(30, 41, 59, 1) 0%, rgba(30, 41, 59, 0) 50%, rgba(30, 41, 59, 1) 100%), 
      radial-gradient(circle at bottom left, rgba(30, 41, 59, 1) 0%, rgba(30, 41, 59, 0) 50%, rgba(30, 41, 59, 1) 100%), 
      radial-gradient(circle at bottom right, rgba(30, 41, 59, 1) 0%, rgba(30, 41, 59, 0) 50%, rgba(30, 41, 59, 1) 100%), 
      linear-gradient(to bottom, rgba(30, 41, 59, 0) 0%, rgba(30, 41, 59, 0.4) 80%, rgba(30, 41, 59, 1) 100%), 
      linear-gradient(to top, rgba(30, 41, 59, 1) 0%, rgba(30, 41, 59, 0.1) 20%, rgba(30, 41, 59, 0.15) 90%, rgba(30, 41, 59, 1) 100%),

  url('https://images.igdb.com/igdb/image/upload/t_1080p/${selectRandomArtwork(
    game[0]?.artworks,
    game[0]?.screenshots
  )}.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: -1,
          }}
        ></div>
      </div>
      <div className="flex flex-col mt-4 ">
        <div className="flex flex-row   justify-center">
          <div
            className="mr-10"
            style={{ position: "sticky", top: "0", height: "100%" }}
          >
            <Link href={`/games/${params.game}`}>
              <div className="w-64 h-80 relative group border-1 border-slate-900 ">
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game[0]?.cover?.image_id}.jpg`}
                  fill={true}
                  className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                />
              </div>
            </Link>
          </div>
          <div className=" w-2/5 ">
            <h1 className=" text-4xl mb-4 text-slate-200 ">
              Reviews For {game[0].name}
            </h1>
            <SortButtons
              slug={params.game}
              sort={searchParams.sort}
              rate={searchParams.rating}
            />
            <div className="mt-6">
              {gameReviewData.reviews.map((rev) => (
                <GameHomePageReview
                  review={rev}
                  user={session?.user}
                  game={params.game}
                  key={rev.id}
                />
              ))}
              <ReviewLoader
                gameID={game[0].id}
                user={session?.user}
                rateSort={searchParams?.rating}
                sort={searchParams?.sort}
                ogLength={gameReviewData.reviews.length}
                paramGame={params.game}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
