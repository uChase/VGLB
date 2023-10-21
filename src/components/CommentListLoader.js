"use client";

import React, { useEffect, useState } from "react";
import CommentList from "./CommentList";
import loadMore from "@/utils/loadComment";

function CommentListLoader({
  user,
  revId,
  ogCommentLength,
  searchRatio,
  skip,
  reviewLikes,
}) {
  let skipAmount = skip;
  const [comments, setComments] = useState([]);
  const [showLoad, setShowLoad] = useState(ogCommentLength >= 10);

  const pressed = async () => {
    const importedComments = await loadMore(
      revId,
      skipAmount,
      searchRatio,
      user?.id
    );
    console.log(importedComments);
    if (importedComments.length != 10) {
      setShowLoad(false);
    }
    const newComments = comments.concat(importedComments);
    setComments(newComments);
    skipAmount += 10;
  };
  return (
    <>
      {comments.map((comment) => {
        return (
          <CommentList
            user={user}
            comment={comment}
            revId={revId}
            reviewLikes={reviewLikes}
            key={comment.id}
          />
        );
      })}

      {showLoad ? (
        <button
          className=" cursor-pointer text-lg border border-slate-400 p-3 rounded-lg bg-slate-800 hover:bg-blue-800 font-semibold bg-opacity-60 mt-2 mb-8 "
          onClick={pressed}
        >
          Load More
        </button>
      ) : null}
    </>
  );
}

export default CommentListLoader;
