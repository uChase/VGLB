"use client";
import MakeListModal from "@/components/MakeListModal";
import { deleteList } from "@/utils/listUtils";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function CreatorOptions({ list }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      await deleteList(list.id);
      router.push("/");
    }
  };
  const handleEdit = async () => {
    setOpen(true);
  };

  return (
    <div>
      <MakeListModal open={open} setOpen={setOpen} list={list} isEdit={true} />
      <div className=" flex flex-row my-3">
        <div className="">
          <button
            className="text-red-500 font-semibold flex items-center text-lg"
            onClick={handleDelete}
          >
            <TrashIcon className="h-6 w-6 mr-1" />
            <p className="text-md font-semibold">Delete List</p>
          </button>
        </div>
        <div className=" ml-3">
          <button
            className="  text-blue-500 font-semibold flex items-center text-lg"
            onClick={handleEdit}
          >
            <PencilAltIcon className="h-6 w-6 mr-1" />
            <p className=" text-md font-semibold">Edit List</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatorOptions;
