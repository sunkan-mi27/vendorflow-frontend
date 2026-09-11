import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const resetMutation = useMutation({
    mutationFn: (data) => api.post("/auth/reset-password", data),
    onSuccess: () => {
      setTimeout(() => navigate("/login"), 2000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetMutation.mutate({ token, newPassword });
  };

  if (!token) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h2>Invalid link</h2>
          <p>This reset link is missing or broken. Please request a new one.</p>
          <p style={{ fontSize: 13, marginTop: 14, textAlign: "center" }}>
            <Link to="/forgot-password">Request new link</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Set a new password</h2>
        <p>Choose a new password for your account.</p>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          className="btn-primary"
          type="submit"
          disabled={resetMutation.isPending}
        >
          {resetMutation.isPending ? "Resetting..." : "Reset password"}
        </button>
        {resetMutation.isSuccess && (
          <p style={{ fontSize: 13, marginTop: 14, color: "var(--paid)" }}>
            Password reset! Redirecting to login...
          </p>
        )}
        {resetMutation.isError && (
          <p className="auth-error">
            {resetMutation.error?.response?.data?.error ||
              "Something went wrong"}
          </p>
        )}
      </form>
    </div>
  );
}

export default ResetPassword;
