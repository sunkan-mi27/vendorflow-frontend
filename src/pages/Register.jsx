import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (data) => api.post("/auth/register", data),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    },
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(form);
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p>Start tracking your orders in minutes.</p>
        <input
          name="businessName"
          placeholder="Business name"
          value={form.businessName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn-primary" type="submit">
          Sign up
        </button>
        {registerMutation.isError && (
          <p className="auth-error">
            {registerMutation.error?.response?.data?.error ||
              "Something went wrong"}
          </p>
        )}
        <p style={{ fontSize: 13, marginTop: 14, textAlign: "center" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
