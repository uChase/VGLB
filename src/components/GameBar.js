"use client";

import { Tooltip } from "@mui/material";
import React from "react";

import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { useRouter } from "next/navigation";

function GameBar({ barHeights, spread, avg, slug, isProfile = false }) {
  const getRatingText = (avg) => {
    if (avg > 4.7)
      return (
        <div className="text-lg font-semibold text-blue-600">Masterpiece</div>
      );
    if (avg > 4.2)
      return (
        <div className="text-lg font-semibold text-blue-500">Spectacular</div>
      );
    if (avg > 3.7)
      return <div className="text-lg font-semibold text-green-300">Great</div>;
    if (avg > 3.2)
      return <div className="text-lg font-semibold text-green-200">Good</div>;
    if (avg > 2.7)
      return <div className="text-lg font-semibold text-yellow-500">Mid</div>;
    if (avg > 2.2)
      return <div className="text-lg font-semibold text-yellow-700">Eh</div>;
    if (avg > 1.5)
      return <div className="text-lg font-semibold text-red-400">Bad</div>;
    if (avg == 0) {
      return <div className="text-lg font-semibold ">Not Yet Rated</div>;
    }
    return <div className="text-lg font-semibold text-red-800">Terrible</div>;
  };

  let ratingText;
  if (!isProfile) {
    ratingText = getRatingText(avg);
  }
  const maxBarHeight = Math.max(...barHeights);
  const router = useRouter();

  return (
    <div className={`flex flex-col items-center w-full`}>
      <div
        className={` ${
          isProfile ? " text-slate-400" : null
        } mb-1 text-lg font-bold`}
      >
        Ratings
      </div>

      <div className={`w-full border-b border-slate-400 mb-4`}></div>
      <div
        className={`flex flex-row ${
          !isProfile ? "h-32" : "h-16"
        } w-full justify-center`}
      >
        {barHeights.map((height, index) => (
          <div
            className="flex flex-col items-center mx-1 h-full cursor-pointer "
            onClick={() => {
              if (!isProfile) {
                router.push(
                  `/games/${slug}/review/all?sort=Popular&rating=${(
                    (index + 1) *
                    0.5
                  ).toFixed(1)}`
                );
              }
            }}
          >
            <Tooltip
              className="h-full"
              title={
                <div style={{ display: "flex", alignItems: "center " }}>
                  {`${spread[index]}`}{" "}
                  {Array(Math.floor((index + 1) / 2))
                    .fill(0)
                    .map((_, i) => (
                      <StarIcon key={i} fontSize="inherit" />
                    ))}
                  {(index + 1) % 2 !== 0 && <>½</>}{" "}
                  {`reviews (${height.toFixed(0)}%)`}
                </div>
              }
            >
              <div
                className={`${
                  !isProfile ? "w-5" : "w-3"
                } bg-slate-200 rounded-md`}
                style={{ height: `${(height / maxBarHeight) * 100 + 1}%` }}
              ></div>
              {!isProfile ? (
                <span className="text-xs cursor-default">
                  {((index + 1) * 0.5).toFixed(1)}
                </span>
              ) : null}
            </Tooltip>
          </div>
        ))}
      </div>
      {!isProfile ? (
        <div className="w-full border-b border-slate-400 mb-4 mt-8"></div>
      ) : null}
      {!isProfile ? (
        <>
          <div className="flex items-center text-4xl font-bold">
            <span>{avg.toFixed(1)}</span>
            <StarIcon fontSize="inherit" />
          </div>
          {ratingText}
        </>
      ) : null}
    </div>
  );
}

export default GameBar;
