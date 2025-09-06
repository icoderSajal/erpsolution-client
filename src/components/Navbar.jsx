import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  LogOut,
  ChevronDown,
  PersonStandingIcon,
  LayoutDashboard,
  User2Icon,
  LogOutIcon,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUserCheck } from "react-icons/fa";

const Navbar = ({ onToggleSidebar }) => {
  const { logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-50 flex items-center justify-between bg-[0000] backdrop-blur px-4 py-3 shadow shadow-blue-900">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-white" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>

        <h1 className=" text-xl font-semibold text-white flex items-center gap-2">
          <NavLink to="/" className="flex gap-2">
            <PersonStandingIcon className="text-teal-300" />
            <span> Erp Solutions</span>
          </NavLink>
        </h1>
      </div>

      {/* Right Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition"
        >
          <FaUserCheck size={18} />
          <ChevronDown size={18} />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-50"
            >
              <ul className="py-2 text-gray-800 text-sm font-semibold">
                {/* <li
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/profile/${user?._id}`);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >

                  <User size={16} /> Profile
                </li> */}

                {user.role === 1 ? (
                  <>
                    <li
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      <LayoutDashboard />- Dashboard
                    </li>

                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <User2Icon />-{user.name}
                    </li>
                    <li
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOutIcon size={16} /> Logout
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <FaUserCheck size={18} />-{user.name}
                    </li>
                    <li
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOut size={16} /> Logout
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
