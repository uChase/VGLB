"use client";
import React from "react";

function PlatformsBox({ platforms }) {
  return (
    <div className="p-2  w-64 mt-2 rounded-xl  border-slate-400 text-slate-400">
      <div className="mb-2 text-lg font-bold border-b border-slate-400 ">
        Platforms
      </div>
      <div className="flex flex-wrap">
        {platforms &&
          platforms.map((platform) => (
            <div
              key={platform.id}
              className="m-1 my-1.5 p-1  rounded-xl border border-slate-400  text-sm"
            >
              {platform.name == "PC (Microsoft Windows)" ? (
                <>Windows PC</>
              ) : (
                <>{platform.name}</>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default PlatformsBox;
