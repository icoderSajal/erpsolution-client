import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

const UserAccessManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [menus, setMenus] = useState([]);
  const [perms, setPerms] = useState([]);
  const [menu, setMenu] = useState({
    moduleId: "",
    permissionId: "",
    userId: "",
    permissionName: "",
    defaultPermission: 0,
  });
  const [route, setRoute] = useState({
    routenName: "",
    default: 0,
  });

  const handleToggleChange = (e) => {
    const value = e.target.checked ? 1 : 0;
    setMenu((prev) => ({ ...prev, defaultPermission: value }));
  };

  const handleToggleChange1 = (e) => {
    const value = e.target.checked ? 1 : 0;

    setRoute((prev) => ({ ...prev, routenName: value }));
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/hr/get-alluser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (error) {
      toast.error("Error to fetch User :-", error);
    }
  };

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

  useEffect(() => {
    if (menu.moduleId) {
      api
        .get(`/admin/userpermisson/${menu.moduleId}`)
        .then((res) => setPerms(res.data.userParms))
        .catch(() => console.log("Error fetching permissions"));
    } else {
      setPerms([]);
    }
  }, [menu.moduleId]);

  useEffect(() => {
    fetchUsers();
    fetchModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>User Access Management</h1>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          {/* {currentMenus.length > 0 ? ( */}
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Employee Name</th>
                <th className="px-6 py-3 text-left">Module Name</th>
                <th className="px-6 py-3 text-left">Sub Module</th>
                <th className="px-6 py-3 text-left">Module Access</th>
                <th className="px-6 py-3 text-left">Router Access</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50 text-gray-700">
                <td className="px-6 py-3">1</td>
                <td className="px-6 py-3">
                  <select
                    name="userId"
                    value={menu.userId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="">Select User</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp?.userId?.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-3">
                  <select
                    name="moduleId"
                    value={menu.moduleId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="">Select Modules</option>
                    {menus.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m?.moduleName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-3">
                  {perms.map((p) => (
                    <div key={p._id} value={p._id}>
                      {p.permissionName}
                    </div>
                  ))}
                </td>
                <td>
                  {/* Toggle */}

                  <div className="flex justify-items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menu.defaultPermission === 1}
                        onChange={handleToggleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-black relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                    {/* <span className="ml-3 text-sm font-medium text-gray-800">
                        {menu.defaultPermission === 1
                          ? "Permission"
                          : "No Permission"}
                      </span> */}
                  </div>
                </td>
                <td>
                  {/* Toggle */}

                  <div className="flex justify-items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={route.routenName === 1}
                        onChange={handleToggleChange1}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-black relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                    {/* <span className="ml-3 text-sm font-medium text-gray-800">
                        {menu.defaultPermission === 1
                          ? "Permission"
                          : "No Permission"}
                      </span> */}
                  </div>
                </td>
              </tr>
              {/* {currentMenus.map((menu, index) => (
                  <tr
                    key={menu._id}
                    className="border-t hover:bg-gray-50 text-gray-700"
                  >
                    <td className="px-6 py-3">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-3">{menu.roleName}</td>
                    <td className="px-6 py-3">{menu.roleValue}</td>
                    <td className="px-6 py-3">
                      {menu.active === 1 ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))} */}
            </tbody>
          </table>
          {/* ) : (
            <div className="text-center text-gray-500 py-6">
              No roles found.
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default UserAccessManagement;
