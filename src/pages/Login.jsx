import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      setLoading(false);
      if (res.success) {
        setTimeout(() => {
          navigate("/");
        }, 1000);
        toast.success("Login successfully!!!");
      } else {
        setError(res.message || "Login failed");
        toast.error("Login failed");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || err.message);
    }
  };

  return (
    // <div
    //       className="w-full h-[100vh] bg-cover flex justify-center items-center"
    //       style={{ backgroundImage: `url(${bg})` }}
    //     ></div>
    <div className="w-full h-[100vh] bg-cover flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md  text-white p-8 rounded-2xl   bg-gray-800 backdrop-blur shadow-lg shadow-black"
      >
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              required
              name="email"
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
              className="px-8 py-2 bg-gray-600 text-white font-bold rounded float-end"
            >
              {loading ? "Signing..." : "Login"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
