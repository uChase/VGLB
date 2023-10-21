import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentList from "@/components/CommentList";
import CommentListLoader from "@/components/CommentListLoader";
import GameHomePageReview from "@/components/GameHomePageReview";
import getGameDbData from "@/utils/getGameDbData";
import getIsLiked from "@/utils/getIsLiked";
import getReviewById from "@/utils/getReview";
import getUserById from "@/utils/getUserById";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;

// async function getGame(gameName) {
//   const response = await fetch("https://api.igdb.com/v4/games", {
//     method: "POST",
//     headers: {
//       "Client-ID": clientId,
//       Authorization: "Bearer " + accessToken,
//       "Content-Type": "text/plain",
//     },
//     body: `fields name, cover.image_id; where slug = "${gameName}";`,
//   });
//   const data = await response.json();

//   return data;
// }

function capitalizeSlug(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

async function getReviewAndUser(reviewId, userId) {
  // Fetch the review based on its reviewId.
  const review = await getReviewById(reviewId);

  // Fetch the author of the review.
  const author = await getUserById(review.authorId);

  // Attach the author information to the review.
  review.author = author;

  // If a userId is provided, fetch the user's opinion on the review (like, dislike, etc.).
  if (userId) {
    const liked = await getIsLiked(review.id, userId);
    review.liked = liked;
  }

  return review;
}
async function getReviewComments(reviewId, userId, ratio) {
  if (userId) {
    // First, get the comments made by the user
    let userComments;
    if (ratio == "true") {
      userComments = await prisma.reviewComment.findMany({
        where: {
          reviewId: reviewId,
          authorId: userId,
          isRatio: true,
        },
        orderBy: {
          totalLikes: "desc",
        },
        include: {
          author: true,
        },
      });
    } else {
      userComments = await prisma.reviewComment.findMany({
        where: {
          reviewId: reviewId,
          authorId: userId,
        },
        orderBy: {
          totalLikes: "desc",
        },
        include: {
          author: true,
        },
      });
    }

    // Calculate remaining slots for comments
    const remainingSlots = 10 - userComments.length;

    // Then, get the comments made by other users

    let otherComments;
    if (ratio == "true") {
      otherComments =
        remainingSlots > 0
          ? await prisma.reviewComment.findMany({
              where: {
                reviewId: reviewId,
                authorId: {
                  not: userId,
                },
                isRatio: true,
              },
              orderBy: {
                totalLikes: "desc",
              },
              include: {
                author: true,
              },
              take: remainingSlots,
            })
          : [];
    } else {
      otherComments =
        remainingSlots > 0
          ? await prisma.reviewComment.findMany({
              where: {
                reviewId: reviewId,
                authorId: {
                  not: userId,
                },
              },
              orderBy: {
                totalLikes: "desc",
              },
              include: {
                author: true,
              },
              take: remainingSlots,
            })
          : [];
    }
    // Merge and return the comments
    return {
      comments: [...userComments, ...otherComments],
      remainingSlots: remainingSlots,
    };
  } else {
    const userComments = await prisma.reviewComment.findMany({
      where: {
        reviewId: reviewId,
      },
      orderBy: {
        totalLikes: "desc",
      },
      include: {
        author: true,
      },
      take: 10,
    });
    return { comments: userComments, remainingSlots: 10 };
  }
}

async function getGame(gameName) {
  const response = await fetch("https://api.igdb.com/v4/games", {
    cache: "force-cache",
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: "Bearer " + accessToken,
      "Content-Type": "text/plain",
    },
    body: `fields name, screenshots.image_id, artworks.image_id, cover.image_id; where slug = "${gameName}";`,
  });
  const data = await response.json();

  return data;
}

async function page({ params, searchParams }) {
  const session = await getServerSession(authOptions);
  const review = await getReviewAndUser(params.reviewId, session?.user?.id);
  const { comments, remainingSlots } = await getReviewComments(
    review.id,
    session?.user?.id,
    searchParams?.ratio
  );
  const game = await getGame(params.game);

  return (
    <div>
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
      <div className="flex flex-col w-full justify-center items-center">
        <div className=" flex flex-row border-b w-3/4 py-2 text-4xl mb-4 ">
          Review For
          <Link href={`/games/${params.game}`}>
            <p className="ml-2 text-blue-400 hover:text-blue-700 cursor-pointer">
              {" "}
              {capitalizeSlug(params.game)}{" "}
            </p>
          </Link>
        </div>
        <GameHomePageReview
          review={review}
          user={session?.user}
          game={params.game}
          isFullscreened={true}
          isAuthor={review.authorId == session?.user.id}
        />
        {comments.map((comment) => {
          return (
            <CommentList
              user={session?.user}
              comment={comment}
              revId={params.reviewId}
              reviewLikes={review?.likesCount}
              key={comment.id}
            />
          );
        })}
        <CommentListLoader
          user={session?.user}
          revId={params.reviewId}
          ogCommentLength={comments?.length}
          reviewLikes={review?.likesCount}
          searchRatio={searchParams?.ratio}
          skip={remainingSlots}
        />
      </div>
    </div>
  );
}

export default page;
