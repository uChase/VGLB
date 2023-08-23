"use client";
import React, { useState, useEffect } from "react";
import { XIcon, SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/navigation";
import { SearchStop } from "@/utils/SearchStop";

function FavGameSearchBar({ onGameSelected, making = false }) {
  const [searchValue, setSearchValue] = useState("");
  const [showList, setShowList] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [inputEnabled, setInputEnabled] = useState(true); // New state variable to track if input is enabled

  useEffect(() => {
    let active = true; // Helps avoid setting state on an unmounted component
    if (searchValue !== "" && inputEnabled) {
      // Only show dropdown if input is enabled
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
  }, [searchValue, inputEnabled]); // Depend on inputEnabled as well

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleBlur = () => {
    if (inputEnabled) {
      // Only start timer if input is enabled
      const timer = setTimeout(() => {
        setShowList(false);
      }, 200);
      setTimerId(timer);
    }
  };

  const handleListClick = () => {
    clearTimeout(timerId);
  };

  const handleGameSelect = (game) => {
    if (!making) {
      setSearchValue(game.name);
    } else {
      setSearchValue("");
    }
    setShowList(false);

    if (!making) {
      setInputEnabled(false); // Disable input when game is selected
    }
    if (onGameSelected) {
      onGameSelected(game);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setInputEnabled(true); // Enable input when 'x' is clicked
  };

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          className="w-11/12 bg-slate-600 rounded-md pl-1 pr-1 py-1 text-center "
          placeholder="Search"
          value={searchValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={!inputEnabled} // Disable input based on state
        />
        {searchValue && !inputEnabled && (
          <XIcon
            className="h-5 w-5 text-white absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleClear}
          />
        )}
      </form>
      {/* Search Icon */}
      {showList && (
        <div
          onClick={handleListClick}
          className="absolute left-0 w-full bg-slate-800 p-2 mt-1 overflow-auto max-h-36 rounded-md shadow-lg z-10"
        >
          {searchResults.map((result) => (
            <div
              className={
                "border-b border-slate-500 hover:bg-slate-700 hover:cursor-pointer"
              }
              onClick={() => handleGameSelect(result)}
            >
              <p key={result.id}>{result.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavGameSearchBar;
