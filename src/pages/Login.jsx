import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials) => api.post("/auth/login", credentials),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("vendorEmail", response.data.vendor.email);
      navigate("/dashboard");
      localStorage.setItem("businessName", response.data.vendor.businessName);
      localStorage.setItem(
        "vendorPlatform",
        response.data.vendor.platform || "whatsapp",
      );
      localStorage.setItem("vendorHandle", response.data.vendor.handle || "");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p>Log in to manage your orders.</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="btn-primary"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Log in"}
        </button>
        {loginMutation.isError && (
          <p className="auth-error">Wrong email or password.</p>
        )}
        {/* <p style={{ fontSize: 13, marginTop: 10, textAlign: "center" }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p> */}
        <p style={{ fontSize: 13, marginTop: 14, textAlign: "center" }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
