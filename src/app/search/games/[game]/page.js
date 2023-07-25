import SearchList from "@/components/SearchList";
import Image from "next/image";
import { SearchAllGames } from "@/utils/SearchAllGames";

async function Page({ params }) {
  const name = params.game.replaceAll("%20", " ");

  const data = await SearchAllGames(name);

  return (
    <div>
      <SearchList data={data} searchInput={name} />
    </div>
  );
}

export default Page;
