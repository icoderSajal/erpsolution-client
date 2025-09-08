import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";

import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
const Home = () => {
  const { user, hasPermission, reloadPermissions } = useAuth();
  const [info, setInfo] = useState("");
  const [infomation, setInformation] = useState("");
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/user/permissions/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }); // replace with a protected backend route

        if (res.data.success) {
          setInfo(res.data.up || "");
          hasPermission(res.data.urp);
        }
      } catch (err) {
        setInfo("No protected data");
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    const fetchinfomation = async () => {
      try {
        const res = await api.get(`/user/route-permissions/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }); // replace with a protected backend route

        if (res.data.success) {
          reloadPermissions(res.data.urp);
          setInformation(res.data.urp || "");
        }
      } catch (err) {
        setInformation("No protected data");
      }
    };
    fetchinfomation();
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get(`/admin/getappmodules`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setMenus(res.data.appModules);
          console.log(setMenus(res.data.appModules));
        }
      } catch (err) {
        toast.error(`Error to fetch data`);
      }
    };
    fetchModules();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow">
          <h1 className="text-4xl font-semibold mt-5 mb-5 text-center">
            {/* Welcome{user?.name ? `, ${user.name}` : ""} */}
            Main Menus
          </h1>

          <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
            {menus.map((m) => (
              <NavLink key={m._id} to={m.modulePath}>
                <div className="bg-black h-[100px] flex justify-center items-center text-white transition-all duration-700 hover:ring-1 rounded-2xl">
                  <h1 className="text-white text-2xl p-4 font-bold text-center">
                    {m.moduleName}
                  </h1>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
