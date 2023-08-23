"use client";
import getIsCommentLiked from "@/utils/getIsCommentLiked";
import loadReplies, { addReply, loadUserReplies } from "@/utils/loadReplies";
import thumbsDownComment from "@/utils/thumbsDownComment";
import thumbsUpComment from "@/utils/thumbsUpComment";
import {
  ChevronDownIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  ReplyIcon,
} from "@heroicons/react/outline";
import {
  ThumbDownIcon as ThumbDownSolid,
  ThumbUpIcon as ThumbUpSolid,
} from "@heroicons/react/solid";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ReplyList from "./ReplyList";
import { useRouter } from "next/navigation";
import { getUserByUsername } from "@/utils/getUserById";
import { sendNotification } from "@/utils/notificationUtils";
import { NotifType, PostType } from "@prisma/client";

function extractNames(text) {
  const regex = /@(\w+)/g;
  const namesSet = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    namesSet.add(match[1]);
  }
  return Array.from(namesSet);
}

function CommentList({ comment, user, revId, reviewLikes }) {
  const [thumbComment, setThumbComment] = React.useState(null);
  const [replyOpen, setReplyOpen] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");
  const [lookAtReplies, setLookAtReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [areReplies, setAreReplies] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const [isFirstTimePress, setIsFirstTimePress] = useState(true);
  const [skipAmount, setSkipAmount] = useState(0);
  const [loadOrder, setLoadOrder] = useState("asc");
  const isFirstRender = useRef(true);

  const router = useRouter();

  useEffect(() => {
    async function checkIfReplies() {
      const reply = await loadReplies(user?.id, comment.id, 1, 0);
      if (reply.length != 0) {
        return true;
      }
      const userReplies = await loadUserReplies(user?.id, comment.id, 1, 0);
      if (userReplies.length != 0) {
        return true;
      }
      return false;
    }

    async function loadUserRep() {
      const userReplies = await loadUserReplies(user?.id, comment.id, -1, 0);
      setReplies(replies.concat(userReplies));
    }

    console.log(comment);
    checkIfReplies().then((bool) => {
      if (bool) {
        setAreReplies(true);
        loadUserRep();
      }
    });
  }, []);

  const handlePostReply = async () => {
    if (replyText != "") {
      const rep = await addReply(
        user?.id,
        comment.id,
        replyText,
        comment.authorId,
        user.username
      );
      const userReplies = extractNames(replyText);
      if (userReplies.length > 0) {
        for (let username of userReplies) {
          const notifUser = await getUserByUsername(username);
          console.log(notifUser);
          if (notifUser) {
            await sendNotification(
              notifUser.id,
              user.username,
              NotifType.REPLY,
              PostType.REPLY,
              comment.id
            );
          }
        }
      }
      setReplyOpen(false);
      setReplyText("");
      replies.push(rep);
      setAreReplies(true);
      router.refresh();
    }
  };

  const handleLookAtReplies = async () => {
    if (isFirstTimePress) {
      const reps = await loadReplies(user?.id, comment.id, 5, 0);
      setReplies(replies.concat(reps));
      setIsFirstTimePress(false);
      if (reps.length != 5) {
        setShowLoad(false);
      }
    }
    setLookAtReplies(!lookAtReplies);
  };

  useEffect(() => {
    async function flipOrder() {
      const userReplies = await loadUserReplies(
        user?.id,
        comment.id,
        -1,
        0,
        loadOrder
      );
      setSkipAmount(0);
      const reps = await loadReplies(user?.id, comment.id, 5, 0, loadOrder);
      setReplies(userReplies.concat(reps));
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    flipOrder();
  }, [loadOrder]);

  const loadMoreReplies = async () => {
    const reps = await loadReplies(
      user?.id,
      comment.id,
      5,
      skipAmount + 5,
      loadOrder
    );
    setSkipAmount(skipAmount + 5);

    setReplies(replies.concat(reps));
    if (reps.length != 5) {
      setShowLoad(false);
    }
  };

  const handleThumbUpComment = async () => {
    if (user) {
      if (thumbComment == "up") {
        return;
      }
      if (thumbComment == "down") {
        comment.totalDislikes -= 1;
      }
      comment.totalLikes += 1;
      setThumbComment("up");
      await thumbsUpComment(
        comment.id,
        user?.id,
        revId,
        comment.authorId,
        user.username
      );
    } else {
      alert("sign in to rate");
    }
  };

  const handleThumbDownComment = async () => {
    if (user) {
      if (thumbComment == "down") {
        return;
      }
      if (thumbComment == "up") {
        comment.totalLikes -= 1;
      }
      comment.totalDislikes += 1;
      await thumbsDownComment(
        comment.id,
        user?.id,
        revId,
        comment.authorId,
        user.username
      );

      setThumbComment("down");
    } else {
      alert("sign in to rate");
    }
  };

  useEffect(() => {
    async function getLikedStatus() {
      const op = await getIsCommentLiked(comment.id, user?.id);
      if (op?.opinion == "LIKE") {
        setThumbComment("up");
      } else if (op?.opinion == "DISLIKE") {
        setThumbComment("down");
      }
    }

    getLikedStatus();
  }, []);

  const handleReplyCancel = () => {
    // Clear reply text and close reply box.
    setReplyText("");

    setReplyOpen(false);
  };

  return (
    <>
      <div
        className={`p-4 bg-slate-700 bg-opacity-70 rounded-md mb-4 mt-2 mr-20 ml-20 w-1/2 ${
          comment?.isRatio &&
          comment?.totalLikes > reviewLikes &&
          "border-2 border-green-400"
        }
      ${
        comment?.isRatio &&
        comment?.totalLikes <= reviewLikes &&
        "border-2 border-red-400"
      }
      `}
      >
        <div className="flex justify-between">
          <div>
            <div className="items-center ">
              <div
                className=" cursor-pointer inline-flex flex-row  items-center"
                onClick={() => {
                  router.push(`/u/${comment.author.username}`);
                }}
              >
                <Image src={comment.author.image} width={75} height={75} />
                <p className="ml-4 text-lg font-semibold align-middle">
                  {comment.author.username}
                </p>
              </div>
            </div>
            <div className="text-lg font-bold align-middle items-center  mb-2">
              {comment?.isRatio ? (
                <>
                  {comment?.isRatio && comment?.totalLikes > reviewLikes ? (
                    <div className="flex flex-row items-center text-green-300">
                      {" "}
                      <div
                        className={`h-3 w-3 rounded-full mr-2 ${"bg-blue-500"}`}
                      />{" "}
                      Successful Ratio{" "}
                    </div>
                  ) : (
                    <div className="flex flex-row items-center text-red-300">
                      {" "}
                      <div
                        className={`h-3 w-3 rounded-full mr-2 ${"bg-red-500"}`}
                      />{" "}
                      Attempted Ratio{" "}
                    </div>
                  )}
                </>
              ) : null}
            </div>
            <p className="text-lg mb-4" style={{ textIndent: "80px" }}>
              {comment.content}
            </p>
          </div>
          <div className="cursor-pointer text-slate-400  text-md">
            {comment.createdAt.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="flex flex-col items-center ml-4 justify-center">
            <div
              className={` cursor-pointer rounded-md p-2 ml-4 `}
              onClick={handleThumbUpComment}
            >
              {thumbComment == "up" ? (
                <ThumbUpSolid className="h-6 w-6" />
              ) : (
                <ThumbUpIcon className="h-6 w-6" />
              )}
            </div>
            <p className="mt-2 mb-1 ml-4 text-center">{comment.totalLikes}</p>
            <div
              className={` cursor-pointer rounded-md p-2 ml-4 `}
              onClick={handleThumbDownComment}
            >
              {thumbComment == "down" ? (
                <ThumbDownSolid className="h-6 w-6" />
              ) : (
                <ThumbDownIcon className="h-6 w-6" />
              )}
            </div>
            <p className="mt-2 ml-4 text-center">{comment.totalDislikes}</p>
          </div>
        </div>
        <div className=" flex flex-row justify-between">
          {user?.id ? (
            <button
              className="flex items-center text-blue-500 font-semibold"
              onClick={() => setReplyOpen(!replyOpen)}
            >
              <ReplyIcon className="h-6 w-6 mr-1" />
              Reply
            </button>
          ) : null}
          {areReplies ? (
            <button
              className="flex items-center text-blue-500 font-semibold"
              onClick={handleLookAtReplies}
            >
              <ChevronDownIcon className="h-6 w-6 mr-1" />
              View Replies
            </button>
          ) : null}
        </div>
      </div>
      {replyOpen && (
        <div className=" p-4 w-2/5 rounded-md mb-4 mt-2 mr-20 ml-20  bg-slate-600  bg-opacity-50">
          <textarea
            className="w-full p-2 mt-2 rounded-md text-slate-900"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply here..."
          />
          <div className="flex justify-between mt-2">
            <button
              className="text-red-500 font-semibold"
              onClick={handleReplyCancel}
            >
              Cancel
            </button>
            <button
              className="text-blue-500 font-semibold"
              onClick={handlePostReply}
            >
              Post
            </button>
          </div>
        </div>
      )}
      {lookAtReplies ? (
        <div className="flex flex-col items-center w-1/2 ">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "10px" }}>Recent</div>
            <div
              style={{
                cursor: "pointer",
                color: loadOrder === "asc" ? "white" : "black",
              }}
              onClick={() => setLoadOrder("asc")}
            >
              ▲
            </div>
            <div
              style={{
                cursor: "pointer",
                color: loadOrder === "desc" ? "white" : "black",
              }}
              onClick={() => setLoadOrder("desc")}
            >
              ▼
            </div>
          </div>
          {replies.map((reply) => {
            return (
              <ReplyList
                reply={reply}
                user={user}
                commentId={comment.id}
                commentAuthor={comment.authorId}
              />
            );
          })}
          {showLoad ? (
            <button
              className=" cursor-pointer text-lg border border-slate-400 p-3 rounded-lg bg-slate-800 hover:bg-blue-800 font-semibold bg-opacity-60 mt-2 mb-8 "
              onClick={loadMoreReplies}
            >
              Load More
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default CommentList;
