import Image from "next/image";
import Link from "next/link";

require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;

const getGames = async (all) => {
  let response;
  if (all) {
    response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: "Bearer " + accessToken,
        "Content-Type": "text/plain",
      },
      body: `fields name, follows, cover.image_id, slug; where rating != null & rating_count > 160; 
      sort rating desc;  limit 5;`,
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
        limit 5;
      `,
    });
  }
  const data = await response.json();
  return data;
};

export default async function Gameslist({ all = true }) {
  const data = await getGames(all);
  if (!data) {
    return "error";
  }

  return (
    <div className={"flex flex-row justify-between  mt-4 "}>
      {data?.map((game) => {
        return (
          <div className="mx-2 text-center" key={game.id}>
            <Link href={`/games/${game.slug}`}>
              <div className="relative group border-2 border-slate-500 rounded-md overflow-hidden hover:border-slate-400">
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
                  width={184}
                  height={272}
                  className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                />
                <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
                  <p className="text-slate-100">{game.name}</p>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
