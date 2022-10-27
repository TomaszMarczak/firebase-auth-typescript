import { Link } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PasswordReset from "../components/PasswordReset";

export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const { emailPasswordLogin, error, setError } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRef.current?.value && passwordRef.current?.value) {
      try {
        setError("");
        setLoading(() => true);
        emailPasswordLogin(emailRef.current.value, passwordRef.current.value);
      } catch {
        setError("Failed to sign in.");
      }
    } else setError("Please fill out all fields.");
    setLoading(() => false);
  };
  return (
    <div>
      {!forgotPassword ? (
        <>
          <Card
            className="py-4 px-5 d-flex-column mx-auto"
            style={{ width: "25vw", minWidth: "20rem" }}
          >
            <h3 className="text-center">Sign In</h3>
            <Form onSubmit={handleSubmit} className="d-flex flex-column">
              <Form.Group id="email" className="mt-2">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef}></Form.Control>
              </Form.Group>
              <Form.Group id="password" className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef}></Form.Control>
              </Form.Group>
              <Button
                type="submit"
                className="w-75 mt-3 mx-auto"
                disabled={loading}
              >
                Sign in
              </Button>
            </Form>
            <Button
              variant="outline-secondary"
              className="mt-3 w-75 mx-auto"
              size="sm"
              onClick={() => setForgotPassword(true)}
            >
              Forgot password?
            </Button>
          </Card>
        </>
      ) : (
        <PasswordReset setForgotPassword={setForgotPassword} />
      )}
      {error && (
        <Alert variant="danger" className="mt-3 wrap">
          {error}
        </Alert>
      )}
      <div className="w-100 text-center mt-2" id="underCardText">
        You don't have an account?{" "}
        <Link to="/signup" replace={true}>
          Sign up!
        </Link>
      </div>
    </div>
  );
}
