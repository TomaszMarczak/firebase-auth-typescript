import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { setError, deleteUserAccount } = useAuth();
  return (
    <div className="d-flex gap-3">
      <Button
        variant="outline-danger"
        onClick={deleteUserAccount}
        className="my-3"
      >
        Delete account
      </Button>
      <Button
        className="my-3"
        variant="outline-secondary"
        onClick={() => {
          setError("");
          signOut(auth);
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Sign out
        </Link>
      </Button>
    </div>
  );
}
