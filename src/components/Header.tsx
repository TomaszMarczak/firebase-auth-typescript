import Logout from "./Logout";
import { useAuth } from "../context/AuthContext";
import ProfilePic from "./ProfilePic";

export default function Header() {
  const { currentUser } = useAuth();
  return (
    <>
      <h1 className="text-wrap">
        Hello,{" "}
        {currentUser ? (
          <span className="text-primary my-3">
            {currentUser.displayName || currentUser.email || "somebody...?"}
          </span>
        ) : (
          <span className="my-3 text-secondary">Guest</span>
        )}
      </h1>
      <ProfilePic />
      {currentUser && <Logout />}
    </>
  );
}
