import Image from "next/image";
import Gameslist from "./Gameslist";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Link from "next/link";
import prisma from "@/db";
import GameHomePageReview from "@/components/GameHomePageReview";
import { subDays } from "date-fns"; // make sure you've installed date-fns or a similar library
import { getGameById, getGamesByIds } from "@/utils/getGameById";
import List from "@/components/List";
import Star from "./u/[user]/Star.js";
import ProfilePicture from "@/components/ProfilePicture";
import getIsLiked from "@/utils/getIsLiked";

async function getFriendReviews(userId) {
  const followedUsers = await prisma.follows.findMany({
    where: {
      followerId: userId, // the current user is the follower
    },
    take: 10, // limit to 10 people they follow
    select: {
      followingId: true, // select the IDs of the users being followed
    },
  });

  // Extract the IDs of the users being followed
  const followedUserIds = followedUsers.map((follow) => follow.followingId);

  // Now, fetch the recent reviews from those users
  const reviews = await prisma.review.findMany({
    where: {
      authorId: {
        in: followedUserIds, // the authors of the reviews are in the list of followed users
      },
    },
    orderBy: {
      createdAt: "desc", // newest reviews first
    },
    select: {
      gameId: true,
      Stars: true,
      id: true,
      authorId: true, // select the authorId to know which review belongs to which user
      // Adjust below here
      author: {
        select: {
          image: true, // assuming 'image' is a field of the 'User' model
          border: true, // assuming 'border' is a field of the 'User' model
          username: true,
        },
      },
    },
    take: 10, // you may adjust this number to retrieve the desired number of reviews per user
  });

  return reviews;
}

async function getTopLists() {
  try {
    // Fetch the top 3 lists ordered by likes
    const lists = await prisma.list.findMany({
      orderBy: {
        likes: "desc",
      },
      take: 3, // Limit the number of records returned
      // Select only the fields you're interested in (optional)
      select: {
        id: true,
        authorId: true,
        name: true,
        description: true,
        gamesList: true,
        isOrdered: true,
        likes: true,
        dislikes: true,
        // ... any other fields you want to include
      },
    });

    return lists; // This will return the top 3 lists based on likes
  } catch (error) {
    console.error("Error fetching top lists:", error);
    // Handle or throw error based on your application's needs
  } finally {
    // Ensure the database connection gets closed
    await prisma.$disconnect();
  }
}

async function getTopReviews(userId) {
  // Calculate the date that was 7 days ago
  const oneWeekAgo = subDays(new Date(), 7);

  try {
    const reviews = await prisma.review.findMany({
      where: {
        // Filter reviews that are newer than one week ago
        createdAt: {
          gte: oneWeekAgo,
        },
      },
      orderBy: {
        likesCount: "desc",
      },
      take: 3,
      include: {
        author: {
          select: {
            id: true,
            image: true,
            username: true,
            border: true,
          },
        },
        game: {
          select: {
            gameId: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
      },
    });

    for (let i = 0; i < reviews.length; i++) {
      if (userId) {
        const liked = await getIsLiked(reviews[i].id, userId);
        reviews[i].liked = liked;
      }
    }

    let gameIds = [
      reviews[0]?.game?.gameId,
      reviews[1]?.game?.gameId,
      reviews[2]?.game?.gameId,
    ];
    gameIds = gameIds.filter((item) => item !== undefined);

    const gameDatas = await getGamesByIds(gameIds);
    const sortedGameDatas = gameIds.map((id) =>
      gameDatas.find((game) => game?.id == id)
    );

    for (let i = 0; i < reviews.length; i++) {
      reviews[i].slug = sortedGameDatas[i]?.slug;
      reviews[i].name = sortedGameDatas[i]?.name;
      reviews[i].cover = sortedGameDatas[i]?.cover.image_id;
    }

    return reviews;
  } catch (error) {}
}

export default async function Home() {
  // console.log(reviews);
  const lists = await getTopLists();
  const session = await getServerSession(authOptions);
  const reviews = await getTopReviews(session?.user?.id);

  if (!session?.user) {
    return (
      <div>
        <div className=" inset-0 flex items-center justify-center z-2 translate-y-[-100px]">
          <Image
            src="/catsittt.gif"
            alt="Background"
            width={600}
            height={600}
          />
        </div>
        <div className=" flex flex-col justify-center items-center translate-y-[-230px] z-10 ">
          <div className=" text-3xl   font-extrabold text-center ">
            <div className="py-2">Log Your Played Video Games </div>
            <div className="py-2">Post Your Good [or Bad] Opinions</div>
            <div className="py-2">Ratio Your Friends</div>
          </div>
          <Link href={`/signup`}>
            <div className=" bg-slate-600 bg-opacity-75 text-2xl mt-4 text-slate-100 p-4 border rounded-xl hover:bg-slate-500 hover:bg-opacity-60 hover:cursor-pointer">
              Sign Up Now!
            </div>
          </Link>
          <div className=" text-slate-500 mt-5 text-xl">
            A Better Social Media for a Better Gamer
          </div>

          <div>
            <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
              <h2 className=" text-slate-300 text-lg">Top Games</h2>
              <Link href={"/games"}>
                <h3 className="text-slate-300 cursor-pointer text-sm hover:text-slate-500">
                  See All
                </h3>
              </Link>
            </div>
            <Gameslist />
          </div>
          <div className=" mt-10">
            <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
              <h2 className=" text-slate-300 text-lg">
                Games To Look Forward To
              </h2>
              <Link href={"/games?top=false"}>
                <h3 className="text-slate-300 cursor-pointer text-sm hover:text-slate-500">
                  See All
                </h3>
              </Link>
            </div>
            <Gameslist all={false} />
          </div>
          {/* Now reviews and list */}
          <div className=" w-3/4">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col w-3/5">
                <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
                  <h2 className=" text-slate-300 text-lg">
                    Popular Reviews This Week
                  </h2>
                  <Link href={`/reviews`}>
                    <h3 className="text-slate-300 cursor-pointer text-sm hover:text-slate-500">
                      See All
                    </h3>
                  </Link>
                </div>
                {reviews.map((rev) => (
                  <div key={rev.id}>
                    <h1 className="text-slate-300 text-lg flex flex-row mb-2  justify-center">
                      Review For{" "}
                      <Link href={`/games/${rev.slug}`}>
                        <p className="ml-2 text-blue-500 hover:text-blue-900  font-bold cursor-pointer">
                          {rev.name}
                        </p>
                      </Link>
                    </h1>
                    <div className=" flex flex-row justify-between items-center mb-3">
                      <div className="mr-4">
                        <Link href={`/games/${rev?.slug}`}>
                          <div
                            key={rev.id}
                            className={`relative group border-2 mx-1 rounded-md overflow-hidden cursor-pointer `}
                          >
                            <Image
                              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${rev?.cover}.jpg`}
                              width={134}
                              height={222}
                              className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
                            />
                            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
                              <p className="text-slate-100 text-center">
                                {rev.name}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="w-3/4">
                        <GameHomePageReview
                          review={rev}
                          user={session?.user}
                          game={rev.slug}
                          // isAuthor={session?.user?.id == userWithProfile.id}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ml-10 w-2/5 ">
                <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-center ml-4 ">
                  <h2 className=" text-slate-300 text-lg">Popular Lists</h2>
                </div>
                <div className="flex flex-col">
                  {lists.map((list, index) => {
                    return <List list={list} key={index} />;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const friendRecents = await getFriendReviews(session.user.id);
  const gamers = [];

  for (let rev of friendRecents) {
    gamers.push(rev.gameId);
  }
  let games = [];
  if (gamers.length != 0) {
    games = await getGamesByIds(gamers);
  }
  const sortedGameDatas = friendRecents.map((rev) => {
    const game = games.find((game) => game?.id == rev.gameId);
    rev.slug = game.slug;
    rev.cover = game.cover;
    rev.name = game.name;

    return rev;
  });

  return (
    <>
      <div className=" flex flex-col justify-center items-center   ">
        <div className=" text-3xl text-center font-extrabold text-slate-100 ">
          {sortedGameDatas.length != 0 ? (
            <div className="py-2"> Welcome back, {session.user.username}</div>
          ) : (
            <div className="absolute z-10 translate-x-36">
              Welcome back, {session.user.username}
            </div>
          )}
        </div>
        {sortedGameDatas.length != 0 ? (
          <div className="w-1/2">
            <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end ">
              <h2 className=" text-slate-300 text-lg">
                What your friends are up to{" "}
                {sortedGameDatas.length == 0 ? "(lmfao you got none)" : null}
              </h2>
            </div>
            <div className="flex flex-row justify-start overflow-x-auto">
              {sortedGameDatas.map((game, index) => {
                let stars = Math.floor(game?.Stars);
                let showStars = true;
                if (game?.Stars <= 0) {
                  showStars = false;
                }
                let halfStar = game?.Stars % 1 !== 0;
                if (game?.Stars == 0.5) {
                  halfStar = true;
                }

                return (
                  <Link
                    href={`/games/${game?.slug}/review/${game?.id}`}
                    key={game?.id}
                  >
                    <div
                      className={`relative group border-2 mx-1 border-slate-500 hover:border-slate-400 rounded-md overflow-hidden cursor-pointer `}
                    >
                      <Image
                        src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.image_id}.jpg`}
                        width={164}
                        height={252}
                        className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
                        <p className="text-slate-100 text-center">
                          {game?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row pl-2 pt-2 items-center">
                      <ProfilePicture
                        image={game?.author?.image}
                        width={30}
                        height={30}
                        border={game?.author?.border}
                      />
                      {showStars ? (
                        <>
                          {[...Array(stars)].map((e, i) => (
                            <Star key={i} />
                          ))}
                          {halfStar ? <>½</> : null}
                        </>
                      ) : null}
                    </div>
                    <div className=" text-xs ml-2 mt-1 text-slate-300 ">
                      {game?.author?.username}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
        <div
          className={`inset-0 flex items-center justify-center z-2 translate-y-[25px] ${
            sortedGameDatas.length != 0 ? "h-[450px]" : "h-[500px]"
          }`}
        >
          <Image
            src="/catsittt.gif"
            alt="Background"
            width={600}
            height={600}
          />
        </div>
        <div>
          <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
            <h2 className=" text-slate-300 text-lg">Top Games</h2>
            <Link href={"/games?top=true"}>
              <h3 className="text-slate-300 cursor-pointer text-sm hover:text-slate-500">
                See All
              </h3>
            </Link>
          </div>
          <Gameslist />
        </div>
        <div className=" mt-10">
          <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
            <h2 className=" text-slate-300 text-lg">
              Games To Look Forward To
            </h2>
            <Link href={"/games"}>
              <h3 className="text-slate-300 cursor-pointer text-sm hover:text-slate-500">
                See All
              </h3>
            </Link>
          </div>
          <Gameslist all={false} />
        </div>
        <div className=" w-3/4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-3/5">
              <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-end">
                <h2 className=" text-slate-300 text-lg">
                  Popular Reviews This Week
                </h2>
                <Link href={`/reviews`}>
                  <h3 className="text-slate-300 cursor-pointer text-sm hover:text-slate-500">
                    See All
                  </h3>
                </Link>
              </div>
              {reviews.map((rev) => (
                <div key={rev.id}>
                  <h1 className="text-slate-300 text-lg flex flex-row mb-2  justify-center">
                    Review For{" "}
                    <Link href={`/games/${rev.slug}`}>
                      <p className="ml-2 text-blue-500 hover:text-blue-900  font-bold cursor-pointer">
                        {rev.name}
                      </p>
                    </Link>
                  </h1>
                  <div className=" flex flex-row justify-between items-center mb-3">
                    <div className="mr-4">
                      <Link href={`/games/${rev?.slug}`}>
                        <div
                          key={rev.id}
                          className={`relative group border-2 mx-1 rounded-md overflow-hidden cursor-pointer `}
                        >
                          <Image
                            src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${rev?.cover}.jpg`}
                            width={134}
                            height={222}
                            className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
                          />
                          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
                            <p className="text-slate-100 text-center">
                              {rev.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="w-3/4">
                      <GameHomePageReview
                        review={rev}
                        user={session?.user}
                        game={rev.slug}
                        isAuthor={session?.user?.id == rev.authorId}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ml-10 w-2/5 ">
              <div className="flex flex-row justify-between mb-4 border-b border-slate-300 py-2 items-center ml-4 ">
                <h2 className=" text-slate-300 text-lg">Popular Lists</h2>
              </div>
              <div className="flex flex-col">
                {lists.map((list, index) => {
                  return <List list={list} key={index} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
