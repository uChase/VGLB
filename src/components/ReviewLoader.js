"use client";

import React, { useEffect, useState } from "react";
import GameHomePageReview from "./GameHomePageReview";
import { loadRevAndUser } from "@/utils/getGameDbData";

function ReviewLoader({ paramGame, gameID, user, rateSort, sort, ogLength }) {
  const [showLoad, setShowLoad] = useState(ogLength == 15);
  const [reviews, setReviews] = useState([]);
  const [skip, setSkip] = useState(15);
  useEffect(() => {
    console.log(ogLength);
  });

  const pressed = async () => {
    console.log("ran");
    const reviewList = (
      await loadRevAndUser(gameID, user?.id, rateSort, sort, skip)
    ).reviews;
    if (reviewList.length != 15) {
      setShowLoad(false);
    }
    setReviews(reviews.concat(reviewList));
    setSkip(skip + 15);
  };
  return (
    <div className=" flex flex-col justify-center">
      {reviews.map((rev) => (
        <GameHomePageReview review={rev} user={user} game={paramGame} />
      ))}

      {showLoad ? (
        <button
          className=" cursor-pointer justify-center text-lg border border-slate-400 p-3 rounded-lg bg-slate-800 hover:bg-blue-800 font-semibold bg-opacity-60 mt-2 mb-8 "
          onClick={pressed}
        >
          Load More
        </button>
      ) : null}
    </div>
  );
}

export default ReviewLoader;
