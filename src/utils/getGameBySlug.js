"use server";
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;

export default async function getGameBySlug(slug) {
  const response = await fetch("https://api.igdb.com/v4/games", {
    cache: "no-store",
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: "Bearer " + accessToken,
      "Content-Type": "text/plain",
    },
    body: `fields name, platforms.name; where slug = "${slug}";`,
  });
  const data = await response.json();

  return data;
}
