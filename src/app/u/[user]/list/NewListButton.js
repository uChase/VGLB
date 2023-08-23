"use client";
import MakeListModal from "@/components/MakeListModal";
import React, { useState } from "react";

function NewListButton({ userId }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div>
      <MakeListModal userId={userId} open={open} setOpen={setOpen} />
      <div
        className=" text-lg mt-4 px-4 mb-5 text-center border rounded-lg py-2 cursor-pointer bg-slate-600 bg-opacity-40 hover:bg-slate-950"
        onClick={handleClick}
      >
        Create New List
      </div>
    </div>
  );
}

export default NewListButton;
