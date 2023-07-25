"use client";
import updateBio, { updateLocation } from "@/utils/updateBio";
import React, { useState } from "react";

function EnterBio({ session, bio = "", loc = "" }) {
  const [text, setText] = useState(bio);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [location, setLocation] = useState(loc);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateBio(text, session?.user?.id);
      await updateLocation(location, session?.user?.id);
      setMessage("Data updated!");
      setError(false);
    } catch (error) {
      setMessage("Failed to update bio.");
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-1/2">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center">
          <label
            className="block text-gray-500 font-bold mb-1 pr-4"
            htmlFor="location"
          >
            Location
          </label>
          <textarea
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="location"
            rows="1"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="location"
          />
        </div>
        <div className="mb-6 flex flex-col items-center">
          <label
            className="block text-gray-500 font-bold mb-1 pr-4"
            htmlFor="bio"
          >
            Bio
          </label>
          <textarea
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="bio"
            rows="10"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="bio"
          />
        </div>
        {message && (
          <div
            className={`text-sm mb-4 ${
              error ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}
        <div className="flex flex-col items-center">
          <button
            className="shadow bg-slate-700 hover:bg-slate-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EnterBio;
