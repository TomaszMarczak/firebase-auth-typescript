import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { setError } = useAuth();
  return (
    <Button
      className="my-3"
      variant="outline-danger"
      onClick={async () => {
        setError("");
        await signOut(auth);
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        Sign out
      </Link>
    </Button>
  );
}
