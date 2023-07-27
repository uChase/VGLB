"use client";
import { Rating } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function FriendReview({ game, review }) {
  const router = useRouter();
  return (
    <div className="border-2 border-slate-50 p-2 rounded-md  mr-2 bg-slate-600 hover:bg-slate-800 bg-opacity-60">
      <div className="flex items-center justify-center">
        <div>
          <div
            onClick={() => {
              router.push(`/games/${game}/review/${review?.id}`);
            }}
            className=" cursor-pointer inline-flex flex-col justify-center items-center"
          >
            <Image src={review?.author?.image} width={50} height={50} />
            <p className=" align-middle text-md font-semibold">
              {review?.author?.username}
            </p>
            {review?.Stars > 0 ? (
              <Rating
                value={review?.Stars}
                readOnly
                sx={{ "& .MuiRating-icon": { color: "#F1FAEE" } }}
                precision={0.5}
                size="small"
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendReview;
