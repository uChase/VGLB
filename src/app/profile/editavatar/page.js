import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AvatarEditor from "./AvatarEditor";

async function page({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return "log in please, i dont really want to take the five seconds to link the log in page";
  }
  return (
    <div>
      <div className="container mx-auto px-4 w-full">
        <div className="flex flex-col items-center justify-center pb-4 ">
          <h1 className="text-center text-4xl mt-1 p-2  border-b-2 w-1/2 mb-5">
            Edit Avatar
          </h1>
          <AvatarEditor
            userImage={session?.user?.image}
            userID={session?.user?.id}
            realSession={session}
            border={session?.user?.border}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
