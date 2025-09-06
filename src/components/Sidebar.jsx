import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [menus, setMenus] = useState([]);
  const [submenu, setSubmenu] = useState([]);
  const [show, setShow] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get(
          `http://localhost:9000/api/admin/getappdata`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          setMenus(res.data.appData);
        }
      } catch (err) {
        toast.error(`Error to fetch data`);
      }
    };
    fetchModules();
  }, []);

  useEffect(() => {
    //fetchMenus();
  }, []);

  const handleToggle = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="p-6">
        <div className="text-white font-bold text-xl">
          <h1>ADMIN DASHBOARD</h1>
        </div>
        {/* <div className="p-6">{JSON.stringify(menus)}</div> */}
        <div className="p-6 text-white">
          {menus.map((m, index) => (
            <div key={m._id}>
              <div className="flex flex-col gap-4">
                <div
                  className="bg-black px-4 py-2 rounded-2xl mt-5 transition-all duration-700 hover:ring-1"
                  onClick={() => setShow(!show)}
                >
                  <NavLink
                    className="font-bold text-xl cursor-pointer "
                    to={m.modulePath}
                  >
                    <h1 className="text-xl rounded-xl  px-6 py-2 ">
                      {m.moduleName}
                    </h1>
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
