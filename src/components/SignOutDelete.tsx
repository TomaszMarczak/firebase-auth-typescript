import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { setError, deleteUserAccount } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="d-flex gap-3">
      <Button variant="danger" onClick={deleteUserAccount} className="my-3">
        Delete account
      </Button>
      <Button
        className="my-3"
        variant="secondary"
        onClick={() => {
          setError("");
          signOut(auth);
          navigate("/");
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
