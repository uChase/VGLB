"use client";
import {
  getThumbsList,
  thumbsDownList,
  thumbsUpList,
} from "@/utils/listThumbs";
import {
  ChevronDownIcon,
  ThumbUpIcon,
  ThumbDownIcon,
} from "@heroicons/react/outline";
import {
  ThumbDownIcon as ThumbDownSolid,
  ThumbUpIcon as ThumbUpSolid,
} from "@heroicons/react/solid";

import React, { useEffect, useState } from "react";

function Thumbs({ list, userId = false }) {
  const [thumb, setThumb] = useState("none");
  useEffect(() => {
    async function getLike() {
      return await getThumbsList(parseInt(list.id), userId);
    }

    if (userId) {
      getLike().then((result) => {
        console.log(result);
        setThumb(result);
      });
    }
  }, []);

  const handleThumbDown = async () => {
    if (userId) {
      if (thumb != "DISLIKE") {
        await thumbsDownList(parseInt(list.id), userId);
        if (thumb == "LIKE") {
          list.likes -= 1;
        }
        list.dislikes += 1;
        setThumb("DISLIKE");
      }
    }
  };
  const handleThumbUp = async () => {
    if (userId) {
      if (thumb != "LIKE") {
        await thumbsUpList(parseInt(list.id), userId);
        if (thumb == "DISLIKE") {
          list.dislikes -= 1;
        }
        setThumb("LIKE");
        list.likes += 1;
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={` cursor-pointer rounded-md p-2 `}
            onClick={handleThumbUp}
          >
            {thumb == "LIKE" ? (
              <ThumbUpSolid className="h-6 w-6" />
            ) : (
              <ThumbUpIcon className="h-6 w-6" />
            )}
          </div>
          <p className="ml-2">{list.likes}</p>
          <div
            className={` cursor-pointer rounded-md p-2 ml-4 `}
            onClick={handleThumbDown}
          >
            {thumb == "DISLIKE" ? (
              <ThumbDownSolid className="h-6 w-6" />
            ) : (
              <ThumbDownIcon className="h-6 w-6" />
            )}
          </div>
          <p className="ml-2">{list.dislikes}</p>
        </div>
      </div>
    </div>
  );
}

export default Thumbs;
