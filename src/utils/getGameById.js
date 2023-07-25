"use server";

require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;
const clientId = process.env.CLIENT_ID;

export async function getGameById(id) {
  const response = await fetch("https://api.igdb.com/v4/games", {
    cache: "force-cache",
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: "Bearer " + accessToken,
      "Content-Type": "text/plain",
    },
    body: `fields name, cover.image_id, slug; where id = ${id};`,
  });
  const data = await response.json();

  return data;
}

export async function getGamesByIds(ids) {
  // Convert array of IDs to a comma-separated string
  const idString = ids.filter((id) => id !== "empty").join(",");

  const response = await fetch("https://api.igdb.com/v4/games", {
    cache: "force-cache",
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: "Bearer " + accessToken,
      "Content-Type": "text/plain",
    },
    body: `fields name, cover.image_id, slug; where id = (${idString});`, // Update the query to get multiple games
  });

  const data = await response.json();
  return data;
}
