"use server";
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;

export async function SearchAllGames(name) {
  const response = await fetch("https://api.igdb.com/v4/games", {
    cache: "no-store",
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: "Bearer " + accessToken,
      "Content-Type": "text/plain",
    },
    body: `search "${name}"; where version_parent = null; fields name, cover.image_id, slug; limit 100;`,
  });
  const data = await response.json();
  return data;
}
