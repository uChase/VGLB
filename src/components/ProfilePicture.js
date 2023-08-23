import Image from "next/image";
import React from "react";

function ProfilePicture({ image, border = "", width, height, style }) {
  return (
    <div>
      <Image
        width={width}
        height={height}
        style={{
          borderRadius: "5%",
        }}
        src={image}
      />
      {border == "" ? null : (
        <img
          src={`/borders/${border}`}
          style={{
            position: "absolute",
            // top: "0",
            // left: "0",
            width: `${width}px`,
            height: `${height}px`,
            transform: `translateY(-${height}px)`,
            borderRadius: "5%", // or you could use a percentage like "10%"
          }}
        />
      )}{" "}
    </div>
  );
}

export default ProfilePicture;
