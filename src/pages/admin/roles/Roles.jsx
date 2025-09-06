import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { PenBoxIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
const Roles = () => {
  const [menus, setMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [menu, setMenu] = useState({ roleName: "", roleValue: "" });
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
    if (!menu.roleName || menu.roleValue === "")
      return alert("All fields are required");
    const value = Number(menu.roleValue);
    if (isNaN(value) || value < 0 || value > 10)
      return alert("Role value must be between 0 and 10");

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = editId
        ? await api.put(`/admin/update-role/${editId}`, menu, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : await api.post(`/admin/roles`, menu, config);

      if (res.data.success) {
        editId
          ? toast.success("Role updated successfully")
          : toast.success("Role added successfully");

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
      const res = await api.put(`/admin/delete-role/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        toast.success("Cutomer deleted");
        fetchData();
      }
    } catch (error) {
      alert(error);
      toast.error("Failed to delete ");
    }
  };

  const openModal = (menu = null) => {
    if (menu) {
      setMenu({ roleName: menu.roleName, roleValue: menu.roleValue });
      setEditId(menu._id);
    } else {
      setMenu({ roleName: "", roleValue: "" });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setMenu({ roleName: "", roleValue: "" });
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/admin/roles", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setMenus(response.data.roles);
        setFilteredMenus(response.data.roles);
      }
    } catch {
      alert("Failed to fetch menus");
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMenus(menus);
    } else {
      setFilteredMenus(
        menus.filter((m) =>
          m.roleName.toLowerCase().includes(search.toLowerCase())
        )
      );
      setCurrentPage(1);
    }
  }, [search, menus]);

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  return (
    <>
      <div className=" w-full bg-gray-950 py-10 px-4 md:px-10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
          Role Master
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
                  <th className="px-6 py-3 text-left">Role Name</th>
                  <th className="px-6 py-3 text-left">Role Value</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
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
                    <td className="px-6 py-3">{menu.roleName}</td>
                    <td className="px-6 py-3">{menu.roleValue}</td>
                    <td className="px-6 py-3">
                      {menu.active === 1 ? "Active" : "Inactive"}
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => openModal(menu)}
                        className="bg-gray-600 hover:bg-black text-white px-0.5 py-0.5 rounded"
                      >
                        <PenBoxIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(menu._id)}
                        className="bg-gray-600 hover:bg-black text-white px-0.5 py-0.5 rounded"
                      >
                        <Trash2Icon />
                      </button>
                    </td>
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
                    Role Name
                  </label>
                  <input
                    type="text"
                    name="roleName"
                    value={menu.roleName}
                    onChange={handleChange}
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
