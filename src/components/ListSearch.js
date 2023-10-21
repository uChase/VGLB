import { useRouter } from "next/navigation";
import React from "react";
import List from "./List";
import Link from "next/link";

function ListSearch({ searchInput, data }) {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center pb-4 ">
        <h1 className="text-4xl mt-4 mb-2">
          Searching &quot;{searchInput}&quot;
        </h1>
        <h3 className="text-2xl  mb-2">{data?.length} Results</h3>
        <div className="flex gap-4 mb-4 text-lg">
          <Link href={`/search/games/${searchInput}`}>
            <p className=" underline cursor-pointer hover:text-slate-500">
              Games
            </p>
          </Link>
          <Link href={`/search/users/${searchInput}`}>
            <p className=" underline cursor-pointer hover:text-slate-500">
              Users
            </p>
          </Link>
          <p className="text-blue-500 underline cursor-default">Lists</p>
        </div>
        {data.map((list, index) => {
          return (
            <div className="w-1/2" key={index}>
              <List list={list} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListSearch;
