import "./App.css";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Container } from "react-bootstrap";
import { useAuth } from "./context/AuthContext";
import { Route, Navigate, Routes } from "react-router-dom";
import Header from "./components/Header";

function App() {
  const { currentUser } = useAuth();
  return (
    <Container
      className="d-flex align-items-start justify-content-center my-5"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minWidth: "25vw" }}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={currentUser ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={currentUser ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <Login />}
          />
        </Routes>
      </div>
    </Container>
  );
}

export default App;
