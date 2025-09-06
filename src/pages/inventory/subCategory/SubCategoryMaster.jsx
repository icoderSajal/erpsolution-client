import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/axios";

import useFetchData from "../../../hooks/useFetchData";
import SubCategoryTable from "../../../components/SubCategoryTable";
import SubCategoryModal from "../../../components/SubCategoryModal";
import Pagination from "../../../components/Pagination";

export default function SubCategoryMaster() {
  const navigate = useNavigate();
  const { data: menus, refetch: refetchMenus } = useFetchData(
    "/inventory/get-allsubcategories"
  );
  const { data: categories } = useFetchData("/inventory/get-allcategories");

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [menu, setMenu] = useState({
    categoryId: "",
    subcatgoryCode: "",
    subcatgoryName: "",
    active: 0,
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredMenus = menus.filter((m) =>
    m.subcatgoryCode.toLowerCase().includes(search.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentMenus = filteredMenus.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  const handleChange = (e) =>
    setMenu((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleToggleChange = (e) =>
    setMenu((prev) => ({ ...prev, active: e.target.checked ? 1 : 0 }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menu.subcatgoryCode || !menu.subcatgoryName)
      return toast.error("All fields are required");
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await api.put(`/inventory/update-subcategory/${editId}`, menu, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Category updated successfully");
      } else {
        await api.post("/inventory/create-subcategory/", menu, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Category added successfully");
      }
      refetchMenus();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/inventory/delete-subcategory/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category deleted successfully");
      refetchMenus();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const openModal = (menu = null) => {
    if (menu) {
      setMenu({
        categoryId: menu.categoryId?._id || "",
        subcatgoryCode: menu.subcatgoryCode,
        subcatgoryName: menu.subcatgoryName,
        active: Number(menu.active),
      });
      setEditId(menu._id);
    } else {
      setMenu({
        categoryId: "",
        subcatgoryCode: "",
        subcatgoryName: "",
        active: 0,
      });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
        Sub Category Master
      </h1>

      {/* Controls */}
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
            onClick={() => navigate("/inventory")}
            className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-950 hover:ring-1 transition-all"
          >
            Back
          </button>{" "}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {currentMenus.length > 0 ? (
          <SubCategoryTable
            data={currentMenus}
            onEdit={openModal}
            onDelete={handleDelete}
            indexOfFirstItem={indexOfLastItem - itemsPerPage}
          />
        ) : (
          <div className="text-center text-gray-600 mt-6">
            No records available.
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      <SubCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        menu={menu}
        categories={categories}
        handleChange={handleChange}
        handleToggle={handleToggleChange}
        editId={editId}
      />
    </div>
  );
}
