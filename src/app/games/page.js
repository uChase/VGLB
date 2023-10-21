import Image from "next/image";
import Link from "next/link";
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;

const getGame = async (top) => {
  let response;

  if (top) {
    response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: "Bearer " + accessToken,
        "Content-Type": "text/plain",
      },
      body: `fields name, follows, cover.image_id, slug; where rating != null & rating_count > 20; 
      sort rating desc;  limit 48;`,
    });
  } else {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: "Bearer " + accessToken,
        "Content-Type": "text/plain",
      },
      body: `
      fields name, follows, cover.image_id, slug, first_release_date; 
      where follows != 0 & first_release_date > ${currentTimestamp}; 
      sort follows desc; 
      limit 48;
    `,
    });
  }

  return response.json();
};

export default async function Page({ searchParams }) {
  const response = await getGame(searchParams?.top);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl mt-4 mb-2">
        {searchParams?.top ? "Top Games" : "Top Upcoming Games"}
      </h1>
      <h3 className="text-2xl  mb-2">
        {" "}
        Once sufficient data is collected I will gauge this based on the site
        data
      </h3>
      <div className="flex flex-col items-center justify-center pb-4 ">
        {" "}
        <div className="grid grid-cols-6 gap-5">
          {response?.map((game, index) => {
            return (
              <Link
                className="relative group border-2 border-slate-500 rounded-md overflow-hidden hover:border-slate-400 cursor-pointer"
                href={`/games/${game.slug}`}
                key={index}
              >
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.image_id}.jpg`}
                  width={264}
                  height={352}
                  className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
                />
                <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
                  <p className="text-slate-100  text-center">{game.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
