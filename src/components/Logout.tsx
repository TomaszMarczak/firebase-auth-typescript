import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Logout() {
  return (
    <Link to="/">
      <Button
        className="my-3"
        variant="outline-danger"
        onClick={async () => await signOut(auth)}
      >
        Sign out
      </Button>
    </Link>
  );
}
