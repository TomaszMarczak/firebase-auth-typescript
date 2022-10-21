import { useRef, useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Dashboard() {
  const {
    currentUser,
    error,
    setError,
    updateUserEmail,
    updateUserPassword,
    updateUserName,
  } = useAuth();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordRetypeRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    const promises: Promise<void>[] = [];
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    if (
      passwordRef.current?.value &&
      passwordRef.current.value !== passwordRetypeRef.current?.value
    ) {
      setError("Passwords are not the same.");
    } else if (passwordRef.current?.value) {
      promises.push(updateUserPassword(passwordRef.current?.value as string));
    }
    if (emailRef.current?.value !== currentUser?.email) {
      promises.push(updateUserEmail(emailRef.current?.value as string));
    }
    if (nameRef.current?.value !== currentUser?.displayName) {
      promises.push(updateUserName(nameRef.current?.value as string));
    }
    if (promises.length > 0) {
      Promise.all(promises)
        .then(() => {
          setMessage("Changes have been saved.");
          navigate("/", { replace: true });
        })
        .catch(() => {
          setError("Failed to update account");
        })
        .finally(() => {
          setLoading(false);
        });
    } else setLoading(false);
  };

  return (
    <div>
      <Card
        className="py-4 px-5 d-flex-column mx-auto"
        style={{ width: "25vw", minWidth: "20rem" }}
      >
        <h2 className="text-center mb-4">Dashboard</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group id="displayName" className="mt-2">
            <Form.Label>Display name:</Form.Label>
            <Form.Control
              ref={nameRef}
              type="text"
              defaultValue={currentUser?.displayName || ""}
            />
          </Form.Group>
          <Form.Group id="email" className="mt-2">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              ref={emailRef}
              type="email"
              defaultValue={currentUser?.email || ""}
            />
          </Form.Group>
          <Form.Group id="newPassword" className="mt-2">
            <Form.Label>New password:</Form.Label>
            <Form.Control
              ref={passwordRef}
              type="password"
              autoComplete="new-password"
              defaultValue=""
            />
          </Form.Group>
          <Form.Group id="newPasswordRetype" className="mt-2">
            <Form.Label>Re-type new password:</Form.Label>
            <Form.Control ref={passwordRetypeRef} type="password" />
          </Form.Group>
          <Button
            type="submit"
            disabled={loading}
            variant="outline-primary"
            className="mt-3 d-block ms-auto"
          >
            Save changes
          </Button>
        </Form>
        {loading ? (
          <Spinner
            animation="border"
            size="sm"
            className="m-3"
            style={{ position: "absolute", bottom: 0, right: 0 }}
          />
        ) : (
          ""
        )}
      </Card>
      {error && (
        <Alert variant="danger" className="mt-3 wrap">
          {error}
        </Alert>
      )}
      {message && (
        <Alert variant="success" className="mt-3">
          {message}
        </Alert>
      )}
    </div>
  );
}
