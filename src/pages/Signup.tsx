import { Form, Button, Card, Alert } from "react-bootstrap";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordRetypeRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { emailPasswordSignup, error, setError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordRef.current?.value !== passwordRetypeRef.current?.value) {
      setError("Passwords are not the same.");
      return;
    }
    if (
      emailRef.current?.value &&
      passwordRef.current?.value &&
      passwordRetypeRef.current?.value
    ) {
      try {
        setError("");
        setLoading(() => true);
        await emailPasswordSignup(
          emailRef.current.value,
          passwordRef.current.value
        );
      } catch {
        setError("Failed to create an account.");
      }
    } else setError("Please fill out all fields.");
    setLoading(() => false);
  };
  return (
    <div className="">
      <Card
        className="py-4 px-5 d-flex-column mx-auto"
        style={{ width: "25vw", minWidth: "20rem" }}
      >
        <h3 className="text-center mb-4">Sign Up</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email" className="mt-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef}></Form.Control>
          </Form.Group>
          <Form.Group id="password" className="mt-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef}></Form.Control>
          </Form.Group>
          <Form.Group id="passwordRetype" className="mt-2">
            <Form.Label>Re-type password</Form.Label>
            <Form.Control
              type="password"
              ref={passwordRetypeRef}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" className="w-100 mt-3" disabled={loading}>
            Sign Up
          </Button>
        </Form>
      </Card>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      <div className="w-100 text-center mt-2" id="underCardText">
        Already have an account?{" "}
        <Link to="/login" replace={true}>
          Log in!
        </Link>
      </div>
    </div>
  );
}
