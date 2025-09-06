import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Roles = () => {
  const [menus, setMenus] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [menu, setMenu] = useState({
    moduleId: "",
    routerEndpoint: "",
    roleValue: "",
    permissionId: "",
  });
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menu.routerEndpoint || menu.roleValue === "")
      return toast.error("All fields are required");
    const value = Number(menu.roleValue);
    if (isNaN(value) || value < 0 || value > 10)
      return toast.error("Role value must be between 0 and 10");

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = editId
        ? await api.put(`/admin/update-role/${editId}`, menu, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : await api.post(`/admin/route-permissions`, menu, config);

      if (res.data.success) {
        toast.success(
          editId ? "Route updated successfully" : "Route added successfully"
        );
        fetchData();
        closeModal();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/admin/delete-role/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        alert("Role deleted");
        fetchData();
      }
    } catch {
      alert("Failed to delete Role");
    }
  };

  const openModal = (menu = null) => {
    if (menu) {
      setMenu({
        routerEndpoint: menu.routerEndpoint,
        roleValue: menu.roleValue,
      });
      setEditId(menu._id);
    } else {
      setMenu({ routerEndpoint: "", roleValue: "" });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setMenu({ routerEndpoint: "", roleValue: "" });
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/admin/route-permissions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setMenus(response.data.routes);
        setFilteredMenus(response.data.routes);
      }
    } catch {
      toast.error("Failed to fetch menus");
    }
  };

  const fetchPermission = async () => {
    try {
      const response = await api.get("/admin/permissions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setPermissions(response.data.perms);
      }
    } catch {
      toast.error("Failed to fetch permissions");
    }
  };

  const fetchModules = async () => {
    try {
      const response = await api.get("/admin/getappmodules", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setModules(response.data.appModules);
      }
    } catch {
      toast.error("Failed to fetch Modukes");
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMenus(menus);
    } else {
      setFilteredMenus(
        menus.filter((m) =>
          m.routerEndpoint.toLowerCase().includes(search.toLowerCase())
        )
      );
      setCurrentPage(1);
    }
  }, [search, menus]);

  useEffect(() => {
    fetchData();
    fetchPermission();
  }, []);
  useEffect(() => {
    fetchModules();
  }, []);

  const handleEndpointChange = (e) => {
    let value = e.target.value;

    // allow only letters, numbers, /, -, _
    value = value.replace(/[^a-zA-Z0-9/_-]/g, "");

    // always start with "/"
    if (value && !value.startsWith("/")) {
      value = "/" + value;
    }

    setMenu((prev) => ({ ...prev, routerEndpoint: value }));
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  return (
    <>
      <div className=" w-full bg-black py-10 px-4 md:px-10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
          Routes Permission Master
        </h1>

        {/* Top controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-bl-3xl rounded-tr-3xl sm:w-1/3 text-white px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-500"
          />
          <div className="flex gap-3">
            <button
              onClick={() => openModal()}
              className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-950 hover:ring-1 transition-all"
            >
              Add
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-950 hover:ring-1 transition-all"
            >
              Back
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          {currentMenus.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Permission Name</th>
                  <th className="px-6 py-3 text-left">Endpoint</th>
                </tr>
              </thead>
              <tbody>
                {currentMenus.map((menu, index) => (
                  <tr
                    key={menu._id}
                    className="border-t hover:bg-gray-50 text-gray-700"
                  >
                    <td className="px-6 py-3">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-3">
                      {menu.permissionId.permissionName}
                    </td>
                    <td className="px-6 py-3">{menu.routerEndpoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-6">
              No roles found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[0000] bg-opacity-50 backdrop-blur flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg w-full max-w-md"
            >
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center">
                {editId ? "Edit Role" : "Add Role"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Permission
                  </label>
                  <select
                    name="permissionId"
                    onChange={handleChange}
                    value={menu.permissionId}
                    className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Permission</option>
                    {permissions.map((perm) => (
                      <option key={perm._id} value={perm._id}>
                        {perm.permissionName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Module Slug
                  </label>
                  <select
                    name="moduleId"
                    value={menu.moduleId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="">Select Module</option>

                    {modules.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.modulePath}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Endpoint
                  </label>
                  <input
                    type="text"
                    name="routerEndpoint"
                    value={menu.routerEndpoint}
                    onChange={handleEndpointChange}
                    placeholder="e.g., Manager"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role Value (0–10)
                  </label>
                  <select
                    name="roleValue"
                    value={menu.roleValue}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                      menu.roleValue === ""
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-teal-500"
                    }`}
                  >
                    <option value="">Select value</option>
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  {menu.roleValue === "" && (
                    <p className="text-sm text-red-500 mt-1">
                      Please select a valid value.
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-gray-600 text-white font-semibold px-4 py-2 rounded hover:bg-black w-full"
                  >
                    {editId ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Roles;
