import { useEffect, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import { ChevronLeftCircle } from "lucide-react";

import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

export default function InventorySummary() {
  const [routes, setRoutes] = useState([]);
  const { user, userPermissions } = useAuth();

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9000/api/admin/route-permissions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setRoutes(res.data.routes);
        const adminRoutes = res.data.routes.filter(
          (route) => route.moduleId?.moduleName === "Inventory"
        );
        setRoutes(adminRoutes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto text-white bg-gray-600 rounded-2xl">
        <div className=" flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-5 text-left">
            Inventory Menus
          </h1>
          <NavLink
            to="/"
            className="flex gap-2 text-xl bg-black rounded-2xl float-end mx-[50px] px-6 py-2 transition-all duration-700 hover:ring-1"
          >
            <ChevronLeftCircle />
          </NavLink>
        </div>

        <div className="p-6 rounded shadow">
          <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <>
                <div
                  onClick={() =>
                    navigate(
                      `${route.moduleId.modulePath}${route.routerEndpoint}`
                    )
                  }
                  className="bg-gray-900 transition-all duration-700 hover:ring-1 cursor-pointer text-white shadow-2xs rounded-2xl p-5 hover:shadow-xl "
                >
                  <h2>{route.moduleId.moduleName}</h2>
                  <h2 className="text-xl">
                    {route.permissionId?.permissionName}
                  </h2>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
