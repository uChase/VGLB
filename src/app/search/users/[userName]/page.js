import SearchUserList from "@/components/SearchUserList";
import { findUsers } from "@/utils/searchUser";
import { useRouter } from "next/navigation";
import React from "react";

async function page({ params }) {
  const name = params.userName.replaceAll("%20", " ");
  const data = await findUsers(name);

  return (
    <div>
      <SearchUserList data={data} searchInput={name} />
    </div>
  );
}

export default page;
