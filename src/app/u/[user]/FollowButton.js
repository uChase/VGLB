"use client";

import followAsync, { unFollowAsync } from "@/utils/followAsync";
import React, { useState } from "react";

function FollowButton({ userId, otherId, alreadyFollow }) {
  const [following, setFollowing] = useState(alreadyFollow);
  const handleFollow = async () => {
    const following = await followAsync(userId, otherId);
    setFollowing(true);
  };

  const handleUnFollow = async () => {
    await unFollowAsync(userId, otherId);
    setFollowing(false);
  };

  return (
    <>
      {!following ? (
        <div
          className=" text-lg mt-4 px-4 mb-5 text-center border rounded-lg py-2 cursor-pointer bg-slate-600 bg-opacity-40 hover:bg-slate-950"
          onClick={handleFollow}
        >
          Follow
        </div>
      ) : (
        <div
          onClick={handleUnFollow}
          className=" text-lg mt-4  px-4 mb-5  text-center border rounded-lg py-2 cursor-pointer bg-slate-600 bg-opacity-40 hover:bg-slate-950"
        >
          Unfollow
        </div>
      )}
    </>
  );
}

export default FollowButton;
