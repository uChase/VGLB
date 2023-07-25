import React from "react";
import ProfileHeader from "./ProfileHeader";

function layout({ children, params }) {
  return (
    <div>
      <ProfileHeader user={params.user} />
      {children}
    </div>
  );
}

export default layout;
