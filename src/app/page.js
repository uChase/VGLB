import Image from "next/image";
import Gameslist from "./Gameslist";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  return (
    <>
      <Gameslist />
    </>
  );
}
