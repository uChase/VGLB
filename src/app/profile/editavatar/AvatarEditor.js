"use client";
import submitBorder from "@/utils/submitBorder";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function AvatarEditor({ userImage, border = "", userID, realSession }) {
  const [imageBorder, setImageBorder] = useState(border);
  const [sMessage, setSMessage] = useState("");
  useEffect(() => {
    console.log(imageBorder == "");
  }, [imageBorder]);
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  const handleSubmit = async () => {
    await submitBorder(userID, imageBorder);
    await update({
      ...realSession,
      user: {
        ...realSession?.user,
        border: imageBorder,
      },
    });
    setSMessage("Updated Border");
  };

  return (
    <div className="flex flex-col items-center">
      <Image
        src={userImage}
        width={300}
        height={300}
        style={{ borderRadius: "5%" }}
      />
      {imageBorder == "" ? null : (
        <img
          src={`/borders/${imageBorder}`}
          style={{
            position: "absolute",
            // top: "0",
            // left: "0",
            width: "300px",
            height: "300px",

            borderRadius: "5%", // or you could use a percentage like "10%"
          }}
        />
      )}
      <div className="grid grid-cols-6 gap-5  mt-5">
        <div
          className={`border-2  ${
            imageBorder == "" ? "border-slate-50" : "border-slate-500"
          } p-2 rounded-md  mr-2 bg-slate-600 hover:bg-slate-800 bg-opacity-60`}
          onClick={() => {
            setImageBorder("");
          }}
        >
          <div className="flex items-center justify-center">
            <div>
              <div className=" cursor-pointer inline-flex flex-col justify-center items-center">
                <Image src={"/borders/cross.png"} width={125} height={125} />
                <p className="align-middle text-xl font-semibold mt-2">None</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border-2 ${
            imageBorder == "faded.png" ? "border-slate-50" : "border-slate-500"
          } p-2 rounded-md  mr-2 bg-slate-600 hover:bg-slate-800 bg-opacity-60`}
          onClick={() => {
            setImageBorder("faded.png");
          }}
        >
          <div className="flex items-center justify-center">
            <div>
              <div className=" cursor-pointer inline-flex flex-col justify-center items-center">
                <Image src={"/borders/faded.png"} width={125} height={125} />
                <p className=" align-middle text-xl font-semibold mt-2">
                  Faded
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border-2 ${
            imageBorder == "dsword.gif" ? "border-slate-50" : "border-slate-500"
          } p-2 rounded-md  mr-2 bg-slate-600 hover:bg-slate-800 bg-opacity-60`}
          onClick={() => {
            setImageBorder("dsword.gif");
          }}
        >
          <div className="flex items-center justify-center">
            <div>
              <div className=" cursor-pointer inline-flex flex-col justify-center items-center">
                <img src={"/borders/dsword.gif"} width={125} height={125} />
                <p className=" align-middle text-xl font-semibold mt-2">
                  Diamond Sword
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {sMessage == "" ? null : (
        <p className="  text-green-500 mt-2">{sMessage}</p>
      )}
      <div className="flex flex-col items-center">
        <button
          onClick={handleSubmit}
          className="shadow bg-slate-700 mt-7 text-4xl hover:bg-slate-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-7 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AvatarEditor;
