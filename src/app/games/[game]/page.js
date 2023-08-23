import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FriendReview from "@/components/FriendReview";
import GameBar from "@/components/GameBar";
import GameHomePageReview from "@/components/GameHomePageReview";
import GenreBox from "@/components/GenreBox";
import PlatformsBox from "@/components/PlatformsBox";
import ReviewButtons from "@/components/ReviewButtons";
import SignUpToRate from "@/components/SignUpToRate";
import prisma from "@/db";
import getFollowing from "@/utils/getFollowing";
import getGameDbData from "@/utils/getGameDbData";
import getIsLiked from "@/utils/getIsLiked";
import { getPlaylist } from "@/utils/getPlaylist";
import { getHasReview, getHasReviewRating } from "@/utils/getReview";
import getUserById from "@/utils/getUserById";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;

async function getGame(gameName) {
  const response = await fetch("https://api.igdb.com/v4/games", {
    cache: "force-cache",
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: "Bearer " + accessToken,
      "Content-Type": "text/plain",
    },
    body: `fields name, screenshots.image_id, summary, artworks.image_id, artworks.height, genres.name, platforms.name, age_ratings.rating, age_ratings.category, release_dates.date, involved_companies.company.name, cover.image_id; where slug = "${gameName}";`,
  });
  const data = await response.json();

  return data;
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

async function getReviewAndUser(gameId, userId, ratingSort, sort, name, slug) {
  const gameReviewData = await getGameDbData(
    gameId,
    3,
    ratingSort,
    sort,
    null,
    name,
    slug
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

async function getFriendsReview(userId, gameId) {
  if (userId) {
    // Retrieve the users this user is following
    const follows = await getFollowing(userId);

    // Map the follows array to only get the 'followingId'

    // Retrieve reviews made by the people this user is following for the specified game
    const friendsReviews = await prisma.review.findMany({
      where: {
        authorId: {
          in: follows,
        },
        gameId: gameId,
      },
      take: 9,
      select: {
        id: true,
        Stars: true,
        authorId: true,
      },
    });

    for (let i = 0; i < friendsReviews.length; i++) {
      const author = await getUserById(friendsReviews[i].authorId);
      friendsReviews[i].author = author;
    }

    return friendsReviews;
  } else {
    return [];
  }
}

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);
  const game = await getGame(params.game);

  const isFuture =
    new Date(game[0]?.release_dates?.[0]?.date * 1000) > new Date();
  const gameReviewData = await getReviewAndUser(
    game[0].id,
    session?.user?.id,
    "All",
    "Popular",
    game[0].name,
    params.game
  );
  const recentReviewData = await getReviewAndUser(
    game[0].id,
    session?.user?.id,
    "All",
    "Recent"
  );
  const userReview = await getHasReview(session?.user?.id, game[0].id);
  let isPlaylisted = false;
  const playlist = await getPlaylist(session?.user?.id);
  const friendsReviews = await getFriendsReview(session?.user?.id, game[0].id);
  // for (let i = 0; i < 40; i++) {
  //   friendsReviews.push({});
  // }

  if (playlist) {
    if (playlist.includes(game[0].id)) {
      isPlaylisted = true;
    }
  }
  let year;
  if (game[0]?.release_dates) {
    year = new Date(
      parseInt(game[0]?.release_dates[0]?.date) * 1000
    ).getFullYear();
  } else {
    year = "";
  }

  let involved_companies;
  if (game[0]?.involved_companies) {
    involved_companies = game[0]?.involved_companies[0]?.company.name;
  } else {
    involved_companies = "unkwon";
  }

  const barHeights = gameReviewData.reviewSpread.slice(0, 10).map((count) => {
    if (gameReviewData.reviewCount == 0) {
      return 0;
    }
    return (count / gameReviewData.reviewCount) * 100;
  });

  return (
    <>
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

      <div className="flex flex-col mt-4">
        <div className="flex flex-row  justify-center">
          <div
            className="mr-20"
            style={{ position: "sticky", top: "0", height: "100%" }}
          >
            <div className="w-64 h-80 relative group border-4 border-slate-900">
              <Image
                src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game[0]?.cover?.image_id}.jpg`}
                fill={true}
                className="border-4 border-slate-600 rounded-sm"
              />
            </div>

            <PlatformsBox platforms={game[0]?.platforms} />
          </div>

          <div className=" w-2/5 mt-24 ">
            <div className="flex flex-row flex-wrap items-end">
              <h1 className="font-bold text-4xl mr-2">
                {game[0].name} {"   "}{" "}
              </h1>
              <h3 className="text-slate-300 text-center  text-2xl">{year}</h3>
            </div>
            <div className="mb-7">
              <p className="font-light text-xl">By: {involved_companies}</p>
              <p>{game[0].summary}</p>
            </div>
            <div>
              {friendsReviews.length != 0 ? (
                <div>
                  <h2 className="mb-4 border-b border-slate-300 py-2 text-slate-300">
                    Friends Reviews
                  </h2>
                  <div className="flex flex-row flex-wrap justify-center">
                    {friendsReviews.map((rev) => (
                      <FriendReview review={rev} game={params.game} />
                    ))}
                  </div>
                  <div className="  flex flex-row justify-center mt-3">
                    {friendsReviews.length >= 9 ? (
                      <Link href={`/games/${params.game}/review/all`}>
                        <button className=" cursor-pointer justify-center text-lg border border-slate-400 p-3 rounded-lg bg-slate-800 hover:bg-blue-800 font-semibold bg-opacity-60 mt-2 ">
                          See All Friends Reviews
                        </button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
                <h2 className=" text-slate-300">Popular Reviews </h2>
                <Link
                  href={`/games/${params.game}/review/all/?sort=Popular&rating=All`}
                >
                  <h3 className="text-slate-300 cursor-pointer text-sm hover:text-slate-500">
                    See All
                  </h3>
                </Link>
              </div>
              {gameReviewData.reviews.map((rev) => (
                <GameHomePageReview
                  review={rev}
                  user={session?.user}
                  game={params.game}
                />
              ))}
              <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
                <h2 className=" text-slate-300">Recent Reviews </h2>
                <Link
                  href={`/games/${params.game}/review/all/?sort=Recent&rating=All`}
                >
                  <h3 className="text-slate-300 cursor-pointer text-sm hover:text-slate-500">
                    See All
                  </h3>
                </Link>
              </div>
              {recentReviewData.reviews.map((rev) => (
                <GameHomePageReview
                  review={rev}
                  user={session?.user}
                  game={params.game}
                />
              ))}
              <div className=" w-100% flex justify-center items-center">
                <Link
                  href={`/games/${params.game}/review/all/?sort=Recent&rating=All`}
                >
                  <button className=" cursor-pointer justify-center text-lg border border-slate-400 p-3 rounded-lg bg-slate-800 hover:bg-blue-800 font-semibold bg-opacity-60 mt-2 mb-8 ">
                    See All Reviews
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="ml-4">
            <GenreBox genres={game[0]?.genres} />
            <GameBar
              barHeights={barHeights}
              spread={gameReviewData.reviewSpread}
              avg={gameReviewData.averageRating}
              slug={params.game}
            />
            {!session ? (
              <SignUpToRate />
            ) : (
              <ReviewButtons
                game={params.game}
                hasRated={userReview?.Stars}
                hasReviewed={userReview?.content}
                hasPlayListed={isPlaylisted}
                gameId={game[0].id}
                userId={session?.user?.id}
                isFuture={isFuture}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
