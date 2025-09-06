import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { PenBoxIcon, Trash2Icon } from "lucide-react";
export default function EmployeeMasterList() {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await api.get("/hradmin/get-alluser", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setMenus(response.data.employees);
        setFilteredMenus(response.data.employees);
      }
    } catch {
      toast.error("Error to fetch Employess");
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMenus(menus);
    } else {
      setFilteredMenus(
        menus.filter((m) =>
          m.userId.name.toLowerCase().includes(search.toLowerCase())
        )
      );
      setCurrentPage(1);
    }
  }, [search, menus]);

  useEffect(() => {
    fetchData();
  }, []);

  //Handle Delete

  const handleDelete = async (Id) => {
    const confirmDelete = window.confirm(
      "Do you want to delete this Employee?"
    );
    if (!confirmDelete) return;
    try {
      const response = await api.put(
        `/hradmin/delete-user/${Id}`,
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
        toast.success("Employee deleted successfully!");
      } else {
        toast.error("Failed to delete Employee.");
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
      <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Employee Master List
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
              onClick={() => navigate("/hradmin/employeeonboard")}
              className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-950 hover:ring-1 transition-all"
            >
              + Add
            </button>
            <button
              onClick={() => navigate("/hradmin")}
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
                  <th className="px-6 py-3 text-left">Emp. ID</th>
                  {/* <th className="px-6 py-3 text-left">Image</th> */}
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Father's Name</th>
                  <th className="px-6 py-3 text-left">State</th>
                  <th className="px-6 py-3 text-left">City</th>
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
                    <td className="px-6 py-3">{menu.employeeId}</td>
                    {/* <td className="px-6 py-3">
                      <img
                        className="rounded-full"
                        width={40}
                        src={`http://localhost:9000/${menu.userId?.profileImage}`}
                        alt={`${menu?.userId?.name}'s profile`}
                      />
                    </td> */}
                    <td className="px-6 py-3">{menu?.userId?.name}</td>
                    <td className="px-6 py-3">{menu?.fathername}</td>
                    <td className="px-6 py-3">{menu?.state.name}</td>
                    <td className="px-6 py-3">{menu?.city.name}</td>
                    <td className="px-6 py-3">
                      {menu?.active === 1 ? "Active" : "Inactive"}
                    </td>
                    <td className="px-6 py-4  space-x-3">
                      <button
                        className="px-2 py-1 bg-black text-white rounded-2xl"
                        onClick={() =>
                          navigate(`/hradmin/employee/${menu._id}`)
                        }
                      >
                        <PenBoxIcon />
                      </button>
                      <button
                        className="px-2 py-1 bg-black text-white rounded-2xl"
                        onClick={() => handleDelete(menu._id)}
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
    </>
  );
}

//ayan@user.com
