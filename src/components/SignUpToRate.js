"use client";

import { useRouter } from "next/navigation";
import React from "react";

function SignUpToRate() {
  const router = useRouter();
  const clicked = () => {
    router.push("/signup");
  };
  return (
    <div
      className="mt-2 text-slate-200 font-extrabold hover:bg-slate-900   text-center align-middle p-2 rounded-md transition duration-300 ease-in-out cursor-pointer"
      onClick={clicked}
      style={
        {
          // color: "#2a9d8f",
        }
      }
    >
      Sign up to review
    </div>
  );
}

export default SignUpToRate;
