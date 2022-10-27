import SignOutDelete from "./SignOutDelete";
import { useAuth } from "../context/AuthContext";
import ProfilePic from "./ProfilePic";

export default function Header() {
  const { currentUser } = useAuth();
  return (
    <>
      <h2 className="text-wrap" id="header">
        Hello,{" "}
        {currentUser ? (
          <span className="text-info my-3">
            {currentUser.displayName || currentUser.email || "somebody...?"}
          </span>
        ) : (
          <span className="my-3 text-secondary">Guest</span>
        )}
      </h2>
      <ProfilePic />
      {currentUser && <SignOutDelete />}
    </>
  );
}
