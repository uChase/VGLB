"use client";
import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { useRouter } from "next/navigation";
import { addToPlaylist, removeFromPlaylist } from "@/utils/getPlaylist";
import { submitRating } from "@/utils/submitReview";

function ReviewButtons({
  hasRated,
  hasReviewed,
  hasPlayListed,
  game,
  gameId,
  userId,
}) {
  const [value, setValue] = useState(0);
  const [playlist, setPlaylist] = useState(hasPlayListed);
  const router = useRouter();

  useEffect(() => {
    if (hasRated) {
      setValue(hasRated);
    }
    setPlaylist(hasPlayListed);
  }, [hasRated, hasPlayListed]);

  const addPlaylist = async () => {
    if (playlist == false) {
      await addToPlaylist(gameId, userId);
      setPlaylist(true);
    } else {
      await removeFromPlaylist(gameId, userId);
      setPlaylist(false);
    }
  };

  return (
    <div className="flex flex-col border border-gray-500 rounded-md divide-y divide-gray-500 text-slate-300 mt-4 items-center justify-center">
      <div className="p-4 flex flex-col items-center">
        <p className="font-semibold mb-2">{hasRated ? "Rated" : "Rate"}</p>
        <Rating
          name="half-rating"
          defaultValue={0}
          precision={0.5}
          value={value}
          sx={{ "& .MuiRating-icon": { color: "#F1FAEE" } }}
          onChange={async (event, newValue) => {
            setValue(newValue);
            await submitRating(gameId, newValue, userId);
          }}
        />
      </div>
      <button
        className="p-4 text-center hover:bg-gray-900 w-full flex items-center justify-center"
        onClick={() => {
          router.push(`/games/${game}/review`);
        }}
      >
        <p className="font-semibold">
          {!hasReviewed ? "Review" : "Edit Review"}
        </p>
      </button>
      <button
        className="p-4 text-center hover:bg-gray-900 w-full flex items-center justify-center"
        onClick={addPlaylist}
      >
        <p className="font-semibold">
          {!playlist ? "Add to Playlist" : "Remove from Playlist"}
        </p>
      </button>
    </div>
  );
}

export default ReviewButtons;
