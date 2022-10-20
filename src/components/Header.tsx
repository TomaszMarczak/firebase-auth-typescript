import React from "react";
import Logout from "./Logout";
import { useAuth } from "../context/AuthContext";
export default function Header() {
  const { currentUser } = useAuth();
  return (
    <>
      <h1 className="text-wrap">
        Hello,{" "}
        {currentUser ? (
          <span className="text-primary">
            {currentUser.displayName || currentUser.email || "somebody...?"}
          </span>
        ) : (
          "Guest"
        )}
      </h1>
      {currentUser && <Logout />}
    </>
  );
}
