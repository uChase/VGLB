import ListSearch from "@/components/ListSearch";
import prisma from "@/db";
import React from "react";

async function findList(listName) {
  const lists = await prisma.list.findMany({
    where: {
      name: {
        contains: listName,
        mode: "insensitive",
      },
    },
    take: 50,
  });

  return lists;
}

async function page({ params }) {
  const name = params.name.replaceAll("%20", " ");
  const data = await findList(name);

  return (
    <div>
      <ListSearch searchInput={params.name} data={data} />
    </div>
  );
}

export default page;
