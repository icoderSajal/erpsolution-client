import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password);
      setLoading(false);
      if (res.success) {
        navigate("/login");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gray-950 text-white p-8 rounded shadow"
      >
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input
              required
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              required
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              disabled={loading}
              className="px-4 py-2 bg-gray-600 font-bold text-white rounded"
            >
              {loading ? "Saving..." : "Register"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
