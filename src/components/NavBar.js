import { SearchIcon } from "@heroicons/react/solid";

import { signOut, useSession } from "next-auth/react";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import NavAuths from "./NavAuths";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserNav from "./UserNav";

export default async function NavBar() {
  const session = await getServerSession(authOptions);
  const data = session?.user?.id;
  const username = session?.user?.username;
  const image = session?.user?.image;

  return (
    <nav className="flex justify-between items-center p-6 text-white z-10">
      <Link className="text-2xl  font-bold" href={"/"}>
        VGLB
      </Link>
      <div className="flex space-x-4 items-center">
        <UserNav username={username} pfpSrc={image} />
        <NavAuths data={data} />
        <Link className="hover:text-gray-300" href={"/"}>
          What To Play
        </Link>
        <Link className="hover:text-gray-300" href={"/"}>
          Live Chat
        </Link>
        <SearchBar />
      </div>
    </nav>
  );
}