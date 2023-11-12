import { SearchIcon } from "@heroicons/react/solid";

import { signOut, useSession } from "next-auth/react";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import NavAuths from "./NavAuths";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserNav from "./UserNav";
import NavBell from "./NavBell";
import { getNotifications } from "@/utils/notificationUtils";
import Image from "next/image";

export default async function NavBar() {
  const session = await getServerSession(authOptions);
  const data = session?.user?.id;
  const username = session?.user?.username;
  const image = session?.user?.image;
  const border = session?.user?.border;
  const notifications = await getNotifications(session?.user?.id);

  return (
    <div className="py-16 min-w-[5]">
      <div className="absolute top-0 left-0 right-0 z-50 bg-opacity-90   min-w-[850px]">
        {" "}
        {/* Adjust z-index if needed */}
        <nav className="container mx-auto flex min-w-[716px] justify-between items-center px-3 py-6 text-white">
          {/* Logo and site name */}
          <Link className="text-2xl  font-bold" href={"/"}>
            <div className=" flex flex-row items-center">
              <Image src={"/logo.PNG"} width={85} height={85} />
              VGLB
            </div>
          </Link>

          {/* Other navbar items */}
          <div className="flex space-x-4 items-center">
            {data ? <NavBell notifs={notifications} userId={data} /> : null}
            <UserNav username={username} pfpSrc={image} border={border} />
            <NavAuths data={data} />
            <SearchBar />
          </div>
        </nav>
      </div>
    </div>
  );
}
