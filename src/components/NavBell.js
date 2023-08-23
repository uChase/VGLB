"use client";
import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FaBell, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  deleteManyNotifications,
  deleteNotification,
} from "@/utils/notificationUtils";

function NavBell({ notifs: initialNotifs, userId }) {
  const [notifs, setNotifs] = useState(initialNotifs);

  console.log(initialNotifs);
  const handleDelete = async (event, index, id) => {
    event.stopPropagation();
    console.log("deleted");
    const newNotifs = notifs.filter((_, i) => i !== index);
    setNotifs(newNotifs);
    await deleteNotification(id);
  };

  const handleClear = async () => {
    setNotifs([]);
    await deleteManyNotifications(userId);
  };
  const router = useRouter();

  const handlePress = (notif) => {
    console.log(notif);
    switch (notif.type) {
      case "FOLLOW":
        router.push(`/u/${notif.sender}`);
        break;
      case "LIKE":
        switch (notif.postType) {
          case "REVIEW":
            router.push(
              `/games/${notif.review.game.slug}/review/${notif.review.id}`
            );
            break;
          case "COMMENT":
            router.push(
              `/games/${notif.comment.review.game.slug}/review/${notif.comment.review.id}`
            );
        }
        break;
      case "DISLIKE":
        switch (notif.postType) {
          case "REVIEW":
            router.push(
              `/games/${notif.review.game.slug}/review/${notif.review.id}`
            );
            break;
          case "COMMENT":
            router.push(
              `/games/${notif.comment.review.game.slug}/review/${notif.comment.review.id}`
            );
        }
      case "COMMENT":
        switch (notif.postType) {
          case "REVIEW":
            router.push(
              `/games/${notif.review.game.slug}/review/${notif.review.id}`
            );
        }
        break;
      case "REPLY":
        switch (notif.postType) {
          case "COMMENT":
            router.push(
              `/games/${notif.comment.review.game.slug}/review/${notif.comment.review.id}`
            );
            break;
          case "REPLY":
            router.push(
              `/games/${notif.comment.review.game.slug}/review/${notif.comment.review.id}`
            );
        }
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="transition-all duration-200 inline-flex items-center justify-center w-full rounded-md shadow-sm px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600 hover:bg-opacity-60 focus:outline-none focus:ring-slate-400">
          <div className="relative">
            <FaBell className="text-xl" />
            <div className="absolute  -bottom-3 left-0 text-xs ">
              {notifs.length > 0 ? `${notifs.length}` : null}
            </div>
          </div>
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
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-900 text-slate-100 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-48">
          <div className="py-1">
            {notifs.length === 0 ? (
              <Menu.Item>
                <button className="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left">
                  You have zero notifications!
                </button>
              </Menu.Item>
            ) : (
              <div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleClear}
                      className={`${
                        active ? "transition bg-slate-600 " : ""
                      } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left items-center`}
                    >
                      Clear Notifications
                    </button>
                  )}
                </Menu.Item>
                {notifs.map((notif, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <button
                        onClick={() => handlePress(notif)}
                        className={`${
                          active ? "transition bg-slate-600 " : ""
                        } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                      >
                        {(() => {
                          switch (notif.type) {
                            case "FOLLOW":
                              return <div>{notif.sender} followed you!</div>;
                            case "LIKE":
                              switch (notif.postType) {
                                case "REVIEW":
                                  return (
                                    <div>
                                      {notif.sender} liked your review of{" "}
                                      {notif.review.game.name}
                                    </div>
                                  );
                                  break;
                                case "COMMENT":
                                  return (
                                    <div>{notif.sender} liked your comment</div>
                                  );
                              }
                              break;
                            case "DISLIKE":
                              switch (notif.postType) {
                                case "REVIEW":
                                  return (
                                    <div>
                                      {notif.sender} disliked your review of{" "}
                                      {notif.review.game.name}
                                    </div>
                                  );
                                  break;
                                case "COMMENT":
                                  return (
                                    <div>
                                      {notif.sender} disliked your comment
                                    </div>
                                  );
                              }
                              break;
                            case "COMMENT":
                              switch (notif.postType) {
                                case "REVIEW":
                                  return (
                                    <div>
                                      {notif.sender} commented on your review of{" "}
                                      {notif.review.game.name}
                                    </div>
                                  );
                                  break;
                              }
                              break;
                            case "REPLY":
                              switch (notif.postType) {
                                case "COMMENT":
                                  return (
                                    <div>
                                      {notif.sender} replied to your comment
                                    </div>
                                  );
                                case "REPLY":
                                  return (
                                    <div>
                                      {notif.sender} tagged you in a reply
                                    </div>
                                  );
                              }
                            default:
                              return "Notification";
                          }
                        })()}
                        <FaTimes
                          className="text-red-500"
                          onClick={(event) =>
                            handleDelete(event, index, notif.id)
                          }
                        />
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default NavBell;
