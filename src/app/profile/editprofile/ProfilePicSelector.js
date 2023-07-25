"use client";

import AvatarEditor from "react-avatar-editor";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { pushImage } from "@/utils/pushImage";

function ProfilePicSelector({ realSession }) {
  const [file, setFile] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [editor, setEditor] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  const username = realSession?.user?.username;
  const userId = realSession?.user?.id;
  let imageVersion = realSession?.user?.imageVersion;

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 1000000) {
      // 1MB limit
      alert("File is too large!");
      return;
    }
    setFile(file);
    setMessage(null); // Reset the message
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const canvas = editor.getImageScaledToCanvas().toDataURL();
    try {
      await pushImage(
        canvas,
        username,
        userId,
        realSession?.user?.image,
        imageVersion
      );
      imageVersion += 1;
      setMessage("Image successfully uploaded.");

      await update({
        ...realSession,
        user: {
          ...realSession?.user,
          image: `https://d38r4fcwx16olc.cloudfront.net/profilepictures/${userId}_${imageVersion}.jpg`,
          imageVersion: imageVersion,
        },
      });
    } catch (e) {
      setMessage("Error uploading image. Please try again later.");
    } finally {
      setFile(null); // Clear the file input
    }
  };

  const handleScale = (e) => {
    setScale(parseFloat(e.target.value));
  };

  const setEditorRef = (editor) => setEditor(editor);

  return (
    <div className="flex flex-col mb-5 items-center ">
      <label
        className="block text-gray-500 font-bold mb-1 pr-4 items-center"
        htmlFor="bio"
      >
        Input Avatar
      </label>
      <form onSubmit={onFormSubmit}>
        <input type="file" onChange={onFileChange} />
        <button
          type="submit"
          className=" text-slate-300 border-2 p-1 italic hover:text-slate-500 rounded-full hover:bg-slate-600"
        >
          Upload
        </button>
      </form>
      {file && (
        <div>
          <AvatarEditor
            ref={setEditorRef}
            image={file}
            width={256}
            height={256}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={scale}
            rotate={0}
          />
          <input
            name="scale"
            type="range"
            onChange={handleScale}
            min="1"
            max="2"
            step="0.01"
            defaultValue="1.2"
          />
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfilePicSelector;
