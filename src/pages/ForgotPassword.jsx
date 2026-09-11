import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const forgotMutation = useMutation({
    mutationFn: (data) => api.post("/auth/forgot-password", data),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotMutation.mutate({ email });
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Reset your password</h2>
        <p>Enter your email and we'll send you a reset link.</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="btn-primary"
          type="submit"
          disabled={forgotMutation.isPending}
        >
          {forgotMutation.isPending ? "Sending..." : "Send reset link"}
        </button>
        {forgotMutation.isSuccess && (
          <p style={{ fontSize: 13, marginTop: 14, color: "var(--paid)" }}>
            If that email exists, a reset link has been sent. Check your inbox.
          </p>
        )}
        <p style={{ fontSize: 13, marginTop: 14, textAlign: "center" }}>
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
