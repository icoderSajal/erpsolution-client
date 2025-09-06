import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { PenBoxIcon, Trash2Icon } from "lucide-react";

import api from "../../../api/axios";

const DepartmentMaster = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [menu, setMenu] = useState({
    deparmentName: "",
    departmentActive: 0,
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e) => {
    const value = e.target.checked ? 1 : 0;
    setMenu((prev) => ({ ...prev, departmentActive: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!menu.deparmentName) {
      toast.error("Department name is required");

      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (editId) {
        const res = await api.put(
          `/hradmin/update-department/${editId}`,
          menu,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          toast.success("Department updated successfully");

          fetchData();
        }
      } else {
        const res = await api.post("/hradmin/create-department", menu, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          toast.success("Department added successfully");

          fetchData();
        }
      }

      closeModal();
    } catch (error) {
      const errMsg = error.res?.data?.message || "Action failed. Try again.";

      toast.error(errMsg);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Do you want to delete this department?"
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/hradmin/delete-department/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        toast.success("Department deleted");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openModal = (menu = null) => {
    if (menu) {
      setMenu({
        deparmentName: menu.deparmentName,
        departmentActive: Number(menu.departmentActive),
      });
      setEditId(menu._id);
    } else {
      setMenu({ deparmentName: "", departmentActive: 0 });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setMenu({ deparmentName: "", departmentActive: 0 });
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/hradmin/get-alldepartments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setMenus(response.data.departments);
        setFilteredMenus(response.data.departments);
      }
    } catch (error) {
      alert("Failed to fetch permissions");
    }
  };

  // filter by search
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMenus(menus);
    } else {
      setFilteredMenus(
        menus.filter((m) =>
          m.deparmentName.toLowerCase().includes(search.toLowerCase())
        )
      );
      setCurrentPage(1);
    }
  }, [search, menus]);

  useEffect(() => {
    fetchData();
  }, []);

  // pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  return (
    <>
      <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
          Department Master
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
              + Add
            </button>
            <button
              onClick={() => navigate("/hradmin")}
              className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-black transition-all"
            >
              Back
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          {currentMenus?.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-100 text-gray-800">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Department Name</th>

                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentMenus.map((menu, index) => (
                  <tr
                    key={menu._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-all`}
                  >
                    <td className="px-6 py-4">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4">{menu.deparmentName}</td>

                    <td className="px-6 py-4">
                      {menu.departmentActive === 1 ? "Active" : "Inactive"}
                    </td>

                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => openModal(menu)}
                        className="bg-gray-600 hover:bg-black text-white px-2 py-2 rounded-full"
                      >
                        <PenBoxIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(menu._id)}
                        className="bg-gray-600 hover:bg-black text-white px-2 py-2 rounded-full"
                      >
                        <Trash2Icon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-600 mt-6">
              No Modules available.
            </div>
          )}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-300 text-gray-800 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? "bg-gray-700 text-white "
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-300 text-gray-800 disabled:opacity-50"
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
            className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-40 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
            >
              <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                {editId ? "Edit Department" : "Add Department"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    name="deparmentName"
                    value={menu.deparmentName}
                    onChange={handleChange}
                    placeholder="e.g., Create User"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                {/* Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Active
                  </label>
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menu.departmentActive === 1}
                        onChange={handleToggleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-black relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                    <span className="ml-3 text-sm font-medium text-gray-800">
                      {menu.departmentActive === 1 ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between gap-3">
                  <button
                    type="submit"
                    className="bg-gray-600 text-white font-semibold px-4 py-2 rounded hover:bg-black w-full"
                  >
                    {editId ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-500 w-full"
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

export default DepartmentMaster;
