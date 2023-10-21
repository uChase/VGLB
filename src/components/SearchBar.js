"use client";
import React, { useState, useEffect } from "react";
import { SearchIcon } from "@heroicons/react/solid";
import { usePathname, useRouter } from "next/navigation";
import { SearchStop } from "@/utils/SearchStop";

function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [showList, setShowList] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    setSearchValue("");
  }, [pathname]);

  useEffect(() => {
    let active = true; // Helps avoid setting state on an unmounted component
    if (searchValue !== "") {
      const timer = setTimeout(() => {
        if (active) {
          setShowList(true);
        }
        SearchStop(searchValue).then((results) => {
          if (active) {
            console.log("called");
            setSearchResults(results);
          }
        });
      }, 300);
      // Call your async function here

      return () => {
        active = false;
        clearTimeout(timer);
      };
    } else {
      setShowList(false);
      setSearchResults([]);
    }
  }, [searchValue]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleBlur = () => {
    const timer = setTimeout(() => {
      setShowList(false);
    }, 200);
    setTimerId(timer);
  };

  const handleListClick = () => {
    clearTimeout(timerId);
  };

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowList(false);

    router.push(`/search/games/${searchValue}`);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="bg-slate-600 rounded-md pl-10 pr-3 py-1" // Added more padding to the left
          placeholder="Search"
          value={searchValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <button
          type="submit"
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
        >
          <SearchIcon className="h-5 w-5 text-white" />
        </button>
      </form>
      {/* Search Icon */}
      {showList && (
        <div
          onClick={handleListClick}
          className="absolute left-0 w-full bg-slate-800 p-2 mt-1 overflow-auto max-h-36 rounded-md shadow-lg"
        >
          {searchResults.map((result, index) => (
            <div
              className={
                "border-b border-slate-500 hover:bg-slate-700 hover:cursor-pointer"
              }
              key={index}
              onClick={() => {
                setShowList(false);
                router.push(`/games/${result.slug}`);
              }}
            >
              <p key={result.id}>{result.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
