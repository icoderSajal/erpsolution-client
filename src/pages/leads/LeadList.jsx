import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const LeadList = () => {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/admin/getcompanies",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setMenus(response.data.companies);
        setFilteredMenus(response.data.companies);
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
          m.companyName.toLowerCase().includes(search.toLowerCase())
        )
      );
      setCurrentPage(1);
    }
  }, [search, menus]);

  useEffect(() => {
    fetchData();
  }, [menus]);

  const handleDelete = async (Id) => {
    const confirmDelete = window.confirm("Do you want to delete this company?");
    if (!confirmDelete) return;
    try {
      const response = await axios.put(
        `http://localhost:9000/api/admin/delete-company/${Id}`,
        { active: 0 }, // body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setMenus((prev) =>
          prev.map((c) => (c._id === Id ? { ...c, active: 0 } : c))
        );
        toast.success("Company deleted successfully!");
      } else {
        toast.error("Failed to delete Company.");
      }
    } catch (error) {
      if (error.response && error.response.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  return (
    <>
      <div className="min-h-screen w-full bg-gray-100 py-10 px-4 md:px-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Leads List
        </h1>

        {/* Top controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-500 text-gray-700"
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/leads/creation")}
              className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-800 transition-all"
            >
              + Add
            </button>
            <button
              onClick={() => navigate("/leads")}
              className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-black transition-all"
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
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Whatapp No.</th>
                  <th className="px-6 py-3 text-left">Call Back Date & Time</th>
                  <th className="px-6 py-3 text-left">Interest</th>
                  <th className="px-6 py-3 text-left">Priority</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* {currentMenus.map((menu, index) => (
                  <tr
                    key={menu._id}
                    className="border-t hover:bg-gray-50 text-gray-700"
                  >
                    <td className="px-6 py-3">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-3">{menu.companyName}</td>
                    <td className="px-6 py-3">{menu.contactPerson}</td>
                    <td className="px-6 py-3">{menu.state.name}</td>
                    <td className="px-6 py-3">{menu.city.name}</td>
                    <td className="px-6 py-3">
                      {menu.active === 1 ? "Active" : "Inactive"}
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        className="px-2 py-1 bg-black text-white rounded-2xl"
                        onClick={() =>
                          navigate(`/admin/company-master/${menu._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(menu._id)}
                        className="px-2 py-1 bg-black text-white rounded-2xl"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))} */}
                <tr>
                  <td className="px-6 py-3 text-left">1</td>
                  <td className="px-6 py-3 text-left">Sandeep</td>
                  <td className="px-6 py-3 text-left">9215448629</td>
                  <td className="px-6 py-3 text-left">01/01/2025 01:00 PM</td>
                  <td className="px-6 py-3 text-left">Solar Pannel</td>
                  <td className="px-6 py-3 text-left">High</td>
                  <td className="px-6 py-3 text-left">Pending</td>
                  <td className="px-6 py-3 text-left flex gap-2">
                    <button>
                      <FaEdit />
                    </button>
                    <button>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-left">2</td>
                  <td className="px-6 py-3 text-left">Chunni Lal</td>
                  <td className="px-6 py-3 text-left">9215448659</td>
                  <td className="px-6 py-3 text-left">05/01/2025 02:00 PM</td>
                  <td className="px-6 py-3 text-left">Solar Batteries</td>
                  <td className="px-6 py-3 text-left">Low</td>
                  <td className="px-6 py-3 text-left">Working</td>
                  <td className="px-6 py-3 text-left flex gap-2">
                    <button>
                      <FaEdit />
                    </button>
                    <button>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-left">3</td>
                  <td className="px-6 py-3 text-left">Munni Lal</td>
                  <td className="px-6 py-3 text-left">9205448659</td>
                  <td className="px-6 py-3 text-left">05/01/2025 02:00 PM</td>
                  <td className="px-6 py-3 text-left">Solar Invetor</td>
                  <td className="px-6 py-3 text-left">Midium</td>
                  <td className="px-6 py-3 text-left">Approved</td>
                  <td className="px-6 py-3 text-left flex gap-2">
                    <button>
                      <FaEdit />
                    </button>
                    <button>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
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
    </>
  );
};

export default LeadList;
