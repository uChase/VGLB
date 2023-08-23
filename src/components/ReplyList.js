"use client";
import React, { useEffect, useState } from "react";
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
import getIsReplyLiked from "@/utils/getIsReplyLiked";
import { thumbsDownReply, thumbsUpReply } from "@/utils/thumbsReply";
import { addReply } from "@/utils/loadReplies";
import { useRouter } from "next/navigation";
import { sendNotification } from "@/utils/notificationUtils";
import { NotifType, PostType } from "@prisma/client";
import { getUserByUsername } from "@/utils/getUserById";

function extractNames(text) {
  const regex = /@(\w+)/g;
  const namesSet = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    namesSet.add(match[1]);
  }
  return Array.from(namesSet);
}

function ReplyList({ reply, user, commentId, commentAuthor }) {
  const [thumbComment, setThumbComment] = useState(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState(`@${reply.author.username} `);

  const router = useRouter();

  const handlePostReply = async () => {
    if (replyText != "") {
      const rep = await addReply(
        user?.id,
        commentId,
        replyText,
        commentAuthor,
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
              commentId
            );
          }
        }
      }
      setReplyOpen(false);
      setReplyText(`@${reply.author.username} `);
      router.refresh();
    }
  };

  const handleReplyCancel = () => {
    // Clear reply text and close reply box.
    setReplyText(`@${reply.author.username} `);

    setReplyOpen(false);
  };

  useEffect(() => {
    async function getLikedStatus() {
      const op = await getIsReplyLiked(reply.id, user?.id);
      if (op?.opinion == "LIKE") {
        setThumbComment("up");
      } else if (op?.opinion == "DISLIKE") {
        setThumbComment("down");
      }
    }

    getLikedStatus();
  }, []);

  const handleThumbDownComment = async () => {
    if (user) {
      if (thumbComment == "down") {
        return;
      }
      if (thumbComment == "up") {
        reply.totalLikes -= 1;
      }
      reply.totalDislikes += 1;
      await thumbsDownReply(reply.id, user?.id);

      setThumbComment("down");
    } else {
      alert("sign in to rate");
    }
  };

  const handleThumbUpComment = async () => {
    if (user) {
      if (thumbComment == "up") {
        return;
      }
      if (thumbComment == "down") {
        reply.totalDislikes -= 1;
      }
      reply.totalLikes += 1;
      setThumbComment("up");
      await thumbsUpReply(reply.id, user?.id);
    } else {
      alert("sign in to rate");
    }
  };

  return (
    <>
      <div
        className={`p-4 bg-slate-700 bg-opacity-70 rounded-md mb-4 mt-2 mr-20 ml-20 w-1/2
`}
      >
        <div className="flex justify-between">
          <div>
            <div className="items-center ">
              <div
                className=" cursor-pointer inline-flex flex-row  items-center"
                onClick={() => {
                  router.push(`/u/${reply.author.username}`);
                }}
              >
                <Image src={reply.author.image} width={65} height={65} />
                <p className="ml-4 text-md font-semibold align-middle">
                  {reply.author.username}
                </p>
              </div>
            </div>

            <p className="text-md mb-4" style={{ textIndent: "80px" }}>
              {reply.content}
            </p>
          </div>
          <div className="cursor-pointer text-slate-400  text-md">
            {reply.createdAt.toLocaleDateString("en-US", {
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
                <ThumbUpSolid className="h-5 w-5" />
              ) : (
                <ThumbUpIcon className="h-5 w-5" />
              )}
            </div>
            <p className="mt-2 mb-1 ml-4 text-center  text-sm">
              {reply.totalLikes}
            </p>
            <div
              className={` cursor-pointer rounded-md p-2 ml-4 `}
              onClick={handleThumbDownComment}
            >
              {thumbComment == "down" ? (
                <ThumbDownSolid className="h-5 w-5" />
              ) : (
                <ThumbDownIcon className="h-5 w-5" />
              )}
            </div>
            <p className="mt-2 ml-4 text-center text-sm">
              {reply.totalDislikes}
            </p>
          </div>
        </div>
        <div className=" flex flex-row justify-between text-sm">
          {user?.id ? (
            <button
              className="flex items-center text-blue-500 font-semibold"
              onClick={() => setReplyOpen(!replyOpen)}
            >
              <ReplyIcon className="h-4 w-4 mr-1" />
              Reply
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
    </>
  );
}

export default ReplyList;
