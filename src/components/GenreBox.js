"use client";
import React from "react";

function GenreBox({ genres }) {
  return (
    <div className=" mb-2">
      <p className=" text-slate-400  mb-1">Genres</p>
      <div className="flex flex-wrap">
        {genres?.map((genre) => (
          <div
            key={genre.id}
            className="m-1 p-1  text-slate-400 rounded-xl border border-slate-400  text-xs"
          >
            {genre.name == "Role-playing (RPG)" ? <>RPG</> : <>{genre.name}</>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenreBox;
