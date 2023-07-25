"use client";
import React, { useState, useEffect } from "react";
import { SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/navigation";
import { SearchStop } from "@/utils/SearchStop";
import { signOut } from "next-auth/react";

function NavAuths({ data }) {
  const router = useRouter();

  return (
    <div>
      {data != null ? (
        <button
          className="hover:text-gray-300"
          onClick={() => {
            signOut();
          }}
        >
          Log Out
        </button>
      ) : (
        <>
          <button
            className="hover:text-gray-300 mr-2"
            onClick={() => {
              router.push("/signin");
            }}
          >
            Sign In
          </button>
          <button
            className="hover:text-gray-300 ml-2"
            onClick={() => {
              router.push("/signup");
            }}
          >
            Sign Up
          </button>
        </>
      )}
    </div>
  );
}

export default NavAuths;
