"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";

function UserNav({ username, pfpSrc }) {
  const router = useRouter();

  if (username == null) {
    return;
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="transition-all duration-200 inline-flex items-center justify-center w-full rounded-md   shadow-sm px-4 py-2  text-sm font-medium text-slate-100 hover:bg-slate-600 hover:bg-opacity-60 focus:outline-none  focus:ring-slate-400">
          <Image
            src={pfpSrc}
            width={40}
            height={40}
            className="h-10 w-10 rounded-md"
          />
          <p className="ml-2">{username}</p>
          <svg
            className="ml-2 -mr-1 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 7a1 1 0 011.707-.707L10 10.586l3.293-3.293A1 1 0 1115 8.414l-4 4a1 1 0 01-1.414 0l-4-4A1 1 0 015 7z"
              clipRule="evenodd"
            />
          </svg>
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
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    router.push(`/u/${username}`);
                  }}
                  className={`${
                    active ? "transition bg-slate-600 " : ""
                  } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                >
                  Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    router.push("/profile/editprofile");
                  }}
                  className={`${
                    active ? "transition bg-slate-600 " : ""
                  } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                >
                  Edit Profile
                </button>
              )}
            </Menu.Item>
            {/* Repeat <Menu.Item> for other options */}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default UserNav;
