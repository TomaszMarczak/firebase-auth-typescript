import { Form, Button, Card, Alert } from "react-bootstrap";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

type PasswordResetTypes = {
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PasswordReset({
  setForgotPassword,
}: PasswordResetTypes) {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { setError, passwordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (emailRef.current?.value) {
      try {
        setMessage("");
        setLoading(() => true);
        await passwordReset(emailRef.current.value);
        setMessage("Check your inbox!");
      } catch {
        setError("Failed to reset password.");
      }
    } else setError("Please fill out all fields.");
    setLoading(() => false);
  };

  return (
    <>
      <Card
        className="py-4 px-5 d-flex-column mx-auto"
        style={{ width: "25vw", minWidth: "20rem" }}
      >
        <h2 className="text-center mb-4">Password retrieval</h2>
        <Form
          onSubmit={handleSubmit}
          className="d-flex flex-column justify-content-center"
        >
          <Form.Group id="email" className="mt-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef}></Form.Control>
          </Form.Group>
          <Button
            type="submit"
            className="w-75 mt-3 mx-auto"
            disabled={loading}
          >
            Retrieve password
          </Button>
        </Form>
        <Button
          variant="outline-secondary"
          className="mt-3 w-75 mx-auto"
          size="sm"
          onClick={() => setForgotPassword(false)}
        >
          Go back
        </Button>
      </Card>

      {message && (
        <Alert variant="success" className="mt-3">
          {message}{" "}
        </Alert>
      )}
    </>
  );
}
