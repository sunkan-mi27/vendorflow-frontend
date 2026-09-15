import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

const platformLabels = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter/X",
};

function Register() {
  const [searchParams] = useSearchParams();
  const initialPlatform = searchParams.get("platform") || "whatsapp";

  const [platform, setPlatform] = useState(initialPlatform);
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    password: "",
    phone: "",
    handle: "",
  });
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (data) => api.post("/auth/register", data),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("vendorEmail", response.data.vendor.email);
      localStorage.setItem("businessName", response.data.vendor.businessName);
      navigate("/dashboard");
    },
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate({
      businessName: form.businessName,
      email: form.email,
      password: form.password,
      platform,
      phone: platform === "whatsapp" ? form.phone : undefined,
      handle: platform !== "whatsapp" ? form.handle : undefined,
    });
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p>Signing up with {platformLabels[platform]}</p>

        <div className="platform-picker">
          {Object.keys(platformLabels).map((key) => (
            <button
              key={key}
              type="button"
              className={`platform-pill ${platform === key ? "active" : ""}`}
              onClick={() => setPlatform(key)}
            >
              {platformLabels[key]}
            </button>
          ))}
        </div>

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

        {platform === "whatsapp" ? (
          <input
            name="phone"
            placeholder="WhatsApp number (2348...)"
            value={form.phone}
            onChange={handleChange}
            required
          />
        ) : (
          <input
            name="handle"
            placeholder={`${platformLabels[platform]} handle (without @)`}
            value={form.handle}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          className="btn-primary"
          type="submit"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account..." : "Sign up"}
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
