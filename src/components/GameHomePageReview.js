"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ThumbUpIcon,
  ThumbDownIcon,
} from "@heroicons/react/outline";
import {
  ThumbDownIcon as ThumbDownSolid,
  ThumbUpIcon as ThumbUpSolid,
} from "@heroicons/react/solid";
import { FormControlLabel, Rating, Tooltip } from "@mui/material";
import getUserById from "@/utils/getUserById";
import { PencilAltIcon } from "@heroicons/react/outline"; // Add import for Pencil (Edit) Icon
import Image from "next/image";
import thumbsUp from "@/utils/thumbsUp";
import thumbsDown from "@/utils/thumbsDown";
import { useRouter } from "next/navigation";
import { ReplyIcon } from "@heroicons/react/outline"; //Importing the ReplyIcon
import addComment from "@/utils/addComment";
import { ChatAltIcon } from "@heroicons/react/outline";
import CommentList from "./CommentList";
import { TrashIcon } from "@heroicons/react/solid"; // Import the TrashIcon from Heroicons
import { deleteReview } from "@/utils/getReview";
import getGameBySlug from "@/utils/getGameBySlug";
import { ServerIcon } from "@heroicons/react/outline"; // Import the game controller icon
import getTldrColor from "@/utils/tldrFunction";
import Checkbox from "@mui/material/Checkbox";
import InfoIcon from "@mui/icons-material/Info";
import { isRatioedFunc } from "@/utils/loadComment";
import ProfilePicture from "./ProfilePicture";

function GameHomePageReview({
  game,
  review,
  user,
  isFullscreened = false,
  isAuthor,
  isProfile,
}) {
  const [showTLDRButton, setShowTLDRButton] = useState(false);
  const [showTLDR, setShowTLDR] = useState(false);
  const [thumb, setThumb] = React.useState(null);
  const [checked, setChecked] = React.useState(false);

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isRatioed, setIsRatioed] = useState(false);

  useEffect(() => {
    async function getIsRatioed() {
      const value = await isRatioedFunc(review.id, review?.likesCount);
      return value;
    }

    getIsRatioed().then((val) => {
      console.log(val);
      setIsRatioed(val);
    });
  }, []);

  const handleReplySubmit = async () => {
    if (replyText != "") {
      await addComment(
        user.id,
        review.id,
        replyText,
        checked,
        review.authorId,
        user.username,
        review.notifEnable
      );
    }
    router.refresh();
    setReplyText("");

    setReplyOpen(false);
  };

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleReplyCancel = () => {
    // Clear reply text and close reply box.
    setReplyText("");

    setReplyOpen(false);
  };

  const handleThumbUp = async () => {
    if (user) {
      if (thumb == "up") {
        return;
      }
      if (thumb == "down") {
        review.dislikesCount -= 1;
      }
      review.likesCount += 1;
      setThumb("up");
      await thumbsUp(
        review.id,
        user.id,
        review.authorId,
        user.username,
        review.notifEnable
      );
    } else {
      alert("sign in to rate");
    }
  };
  const handleThumbDown = async () => {
    if (user) {
      if (thumb == "down") {
        return;
      }
      if (thumb == "up") {
        review.likesCount -= 1;
      }
      review.dislikesCount += 1;
      await thumbsDown(
        review.id,
        user.id,
        review.authorId,
        user.username,
        review.notifEnable
      );

      setThumb("down");
    } else {
      alert("sign in to rate");
    }
  };

  useEffect(() => {
    if (user) {
      if (review.liked?.opinion == "LIKE") {
        setThumb("up");
      } else if (review.liked?.opinion == "DISLIKE") {
        setThumb("down");
      }
    }
  }, []);

  useEffect(() => {
    for (let tldr of review.tldr) {
      if (tldr != "") {
        setShowTLDRButton(true);
        return;
      }
    }
  }, []);
  const router = useRouter();

  const handleEditReview = () => {
    router.push(`/games/${game}/review`);
  };
  const handleDeleteReview = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      // Perform delete action
      const games = await getGameBySlug(game);
      await deleteReview(user.id, games[0].id);
      router.push(`/games/${game}`);
    }
  };

  let count = 0;
  let count2 = 0;

  return (
    <div>
      <div
        className={` p-2 rounded-md  min-w-[400px] mb-4 bg-slate-700 bg-opacity-60 ${
          isFullscreened ? "w-3/4" : ""
        }  ${isRatioed && "border border-red-400"}`}
      >
        <div className="flex items-start justify-start">
          <div className="flex flex-col flex-grow-0  flex-shrink-0 mr-4 ">
            <div
              className=" cursor-pointer inline-flex flex-col items-center"
              onClick={() => {
                router.push(`/u/${review.author.username}`);
              }}
            >
              <ProfilePicture
                image={review?.author?.image}
                width={isFullscreened ? 120 : 70}
                height={isFullscreened ? 120 : 70}
                border={review?.author?.border}
              />

              <p className="text-lg font-semibold">{review.author.username}</p>
            </div>
            {isAuthor && (
              <div className="mt-3">
                <button
                  className="  text-blue-500 font-semibold flex items-center"
                  onClick={handleEditReview}
                >
                  <PencilAltIcon className="h-6 w-6 mr-1" />
                  <p className=" text-md font-semibold">Edit Review</p>
                </button>
              </div>
            )}
            {isAuthor && isFullscreened && (
              <div className="mt-3">
                <button
                  className="text-red-500 font-semibold flex items-center"
                  onClick={handleDeleteReview}
                >
                  <TrashIcon className="h-6 w-6 mr-1" />
                  <p className="text-md font-semibold">Delete Review</p>
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex items-baseline justify-between">
              {review.gameStatus && (
                <div className="flex items-center h-full">
                  <div
                    className={`h-3 w-3 rounded-full mr-2 ${
                      review.gameStatus === "Dropped"
                        ? "bg-red-500"
                        : review.gameStatus === "Playing"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <p className="text-md mr-1">{review.gameStatus}</p>
                </div>
              )}
              {isRatioed && (
                <div
                  className="cursor-pointer text-red-500 font-bold underline hover:text-red-800 text-lg"
                  onClick={() => {
                    router.push(
                      `/games/${game}/review/${review.id}?ratio=true`
                    );
                  }}
                >
                  RATIOED
                </div>
              )}

              <div className=" cursor-default text-slate-400  text-md">
                {review.createdAt.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              {review.platform && (
                <div className="flex items-center mr-2">
                  <ServerIcon className="h-4 w-4 mr-1" />
                  <p className="text-md text-center align-middle">
                    {review.platform}
                  </p>
                </div>
              )}
              <div>
                {" "}
                <SettingsMenu
                  isAuthor={isAuthor}
                  isMuted={review.notifEnable}
                  reviewId={review.id}
                />
              </div>
            </div>
            {!isFullscreened ? (
              <div className="mt-2">
                <p className="text-lg " style={{ textIndent: "50px" }}>
                  {review?.content?.length > 250
                    ? review?.content.substring(0, 250) + "..."
                    : review?.content}
                </p>
                {review?.content?.length > 250 && (
                  <button
                    onClick={() => {
                      router.push(`/games/${game}/review/${review.id}`);
                    }}
                    className=" font-semibold text-md italic text-blue-300 hover:text-blue-600 items-center "
                  >
                    Continue Reading
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {isFullscreened ? (
          <p className="p-2 text-lg " style={{ textIndent: "70px" }}>
            {review?.content?.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        ) : null}

        {showTLDRButton && (
          <>
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => setShowTLDR(!showTLDR)}
            >
              <p className="text-base font-semibold">TLDR</p>
              <ChevronDownIcon className="h-6 w-6" />
            </div>
            {showTLDR && (
              <div className=" p-1 rounded-md flex flex-col">
                <div className=" flex flex-row justify-evenly ">
                  {review.tldr.map((tldr, index) => {
                    if (tldr != "") {
                      let label;
                      count++;

                      switch (index) {
                        case 0:
                          label = "Gameplay";
                          break;
                        case 1:
                          label = "Graphics";
                          break;
                        case 2:
                          label = "Story";
                          break;
                        case 3:
                          label = "Price";
                          break;
                        default:
                          label = "";
                      }
                      console.log(getTldrColor(label, tldr));
                      if (count > 2) {
                        return null;
                      }

                      return (
                        <div
                          className="flex flex-col justify-center items-center w-1/2"
                          key={index}
                        >
                          <div className="relative text-center w-3/4 p-2  text-sm font-semibold flex-grow">
                            <div
                              style={{
                                position: "absolute",
                                bottom: "0",
                                left: "50%",
                                width: "100%",
                                height: "2px",

                                background:
                                  "linear-gradient(to left, transparent, #0D121B, transparent)",
                                transform: "translateX(-50%)",
                              }}
                              className="mt-5 "
                            ></div>
                            {label}
                          </div>
                          <div
                            style={{ color: getTldrColor(label, tldr) }}
                            className="my-2 text-sm italic font-bold"
                          >
                            {tldr}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
                <div className=" flex flex-row justify-evenly ">
                  {review.tldr.map((tldr, index) => {
                    if (tldr != "") {
                      let label;
                      count2++;

                      switch (index) {
                        case 0:
                          label = "Gameplay";
                          break;
                        case 1:
                          label = "Graphics";
                          break;
                        case 2:
                          label = "Story";
                          break;
                        case 3:
                          label = "Price";
                          break;
                        default:
                          label = "";
                      }
                      console.log(getTldrColor(label, tldr));
                      if (count2 <= 2) {
                        return null;
                      }

                      return (
                        <div
                          className="flex flex-col justify-center items-center text-sm w-1/2"
                          key={index}
                        >
                          <div className="relative text-center w-3/4 p-2   text-sm font-semibold flex-grow">
                            <div
                              style={{
                                position: "absolute",
                                bottom: "0",
                                left: "50%",
                                width: "100%",
                                height: "2px",

                                background:
                                  "linear-gradient(to left, transparent, #0D121B, transparent)",
                                transform: "translateX(-50%)",
                              }}
                              className="mt-5 "
                            ></div>
                            {label}
                          </div>
                          <div
                            style={{ color: getTldrColor(label, tldr) }}
                            className="my-2 text-sm italic font-bold"
                          >
                            {tldr}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            )}{" "}
          </>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={` cursor-pointer rounded-md p-2 `}
              onClick={handleThumbUp}
            >
              {thumb == "up" ? (
                <ThumbUpSolid className="h-6 w-6" />
              ) : (
                <ThumbUpIcon className="h-6 w-6" />
              )}
            </div>
            <p className="ml-2">{review.likesCount}</p>
            <div
              className={` cursor-pointer rounded-md p-2 ml-4 `}
              onClick={handleThumbDown}
            >
              {thumb == "down" ? (
                <ThumbDownSolid className="h-6 w-6" />
              ) : (
                <ThumbDownIcon className="h-6 w-6" />
              )}
            </div>
            <p className="ml-2">{review.dislikesCount}</p>
          </div>
          {review.Stars > 0 ? (
            <Rating
              value={review.Stars}
              readOnly
              sx={{ "& .MuiRating-icon": { color: "#F1FAEE" } }}
              precision={0.5}
            />
          ) : (
            <></>
          )}
          {isFullscreened ? (
            <button
              className="flex items-center text-blue-500 font-semibold"
              onClick={() => setReplyOpen(!replyOpen)}
            >
              <ChatAltIcon className="h-6 w-6 mr-1" />
              Comment
            </button>
          ) : (
            <button
              className="text-blue-500 font-semibold flex items-center hover:text-blue-700"
              onClick={() => {
                router.push(`/games/${game}/review/${review.id}`);
              }}
            >
              <ChatAltIcon className="h-6 w-6 mr-1" />
              {review.comments.length != 0
                ? review.comments.length == 1
                  ? "View 1 Comment"
                  : `View ${review.comments.length} Comments`
                : "Start the Conversation"}
            </button>
          )}
        </div>
      </div>
      {replyOpen && (
        <div className=" p-4 w-1/2 rounded-md mb-4 mt-2 mr-20 ml-20 bg-slate-800 bg-opacity-80">
          <textarea
            className="w-full p-2 mt-2 rounded-md text-slate-900"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your comment here..."
          />
          <div className="flex justify-between mt-2">
            <button
              className="text-red-500 font-semibold"
              onClick={handleReplyCancel}
            >
              Cancel
            </button>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleChange} />}
              label={
                <React.Fragment>
                  <span className="text-red-800 font-extrabold  mr-1">
                    RATIO
                  </span>
                  <Tooltip
                    title={`Disagree with this take? Attempt to ratio them by getting more likes and steal the spotlight!`}
                  >
                    <InfoIcon
                      fontSize="small"
                      style={{ marginLeft: 7, verticalAlign: "-4px" }}
                    />
                  </Tooltip>
                </React.Fragment>
              }
            />
            <button
              className="text-blue-500 font-semibold"
              onClick={handleReplySubmit}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameHomePageReview;

import { Menu, Transition } from "@headlessui/react";
import { FaEllipsisV } from "react-icons/fa";
import {
  muteReviewNotification,
  unMuteReviewNotification,
} from "@/utils/muteNotification";

function SettingsMenu({ isAuthor, isMuted: mute, reviewId }) {
  const [isMuted, setIsMute] = useState(mute);
  const handleMute = async () => {
    await muteReviewNotification(reviewId);
    setIsMute(true);
  };
  const handleUnMute = async () => {
    await unMuteReviewNotification(reviewId);
    setIsMute(false);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="transition-all duration-200 inline-flex items-center justify-center w-full rounded-md shadow-sm px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600 hover:bg-opacity-60 focus:outline-none focus:ring-slate-400">
          <FaEllipsisV />
        </Menu.Button>
      </div>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-900 text-slate-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {isAuthor ? (
              isMuted ? (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleMute}
                      className={`${
                        active ? "transition bg-slate-600 " : ""
                      } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                    >
                      Mute Notifications
                    </button>
                  )}
                </Menu.Item>
              ) : (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleUnMute}
                      className={`${
                        active ? "transition bg-slate-600 " : ""
                      } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                    >
                      Unmute Notifications
                    </button>
                  )}
                </Menu.Item>
              )
            ) : (
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "transition bg-slate-600 " : ""
                    } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-red-600`}
                  >
                    Report
                  </button>
                )}
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
