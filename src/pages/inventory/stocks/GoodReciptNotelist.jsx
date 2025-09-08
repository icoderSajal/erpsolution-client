import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { View, SquarePen, Trash } from "lucide-react";

export default function GoodReciptNotelist() {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await api.get("/purchase/getapprovedpurchase", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setMenus(response.data.orders);
        setFilteredMenus(response.data.orders);
        //alert(setMenus(response.data.orders));
      }
    } catch {
      toast.error("Failed to fetch menus");
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMenus(menus);
    } else {
      setFilteredMenus(
        menus.filter((m) =>
          m.itemName.toLowerCase().includes(search.toLowerCase())
        )
      );
      setCurrentPage(1);
    }
  }, [search, menus]);

  useEffect(() => {
    fetchData();
  }, [menus]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // dd
    const month = date.toLocaleString("en-US", { month: "short" }); // mmm
    const year = date.getFullYear(); // yyyy
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
          Goods Receipt Note List
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
              onClick={() => navigate("/inventory/create-grn")}
              className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-950 hover:ring-1 transition-all"
            >
              + Add
            </button>
            <button
              onClick={() => navigate("/inventory")}
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
                  <th className="px-6 py-3 text-left">Vendor Name</th>
                  <th className="px-6 py-3 text-left">PO Date</th>
                  <th className="px-6 py-3 text-left">FinYear</th>
                  <th className="px-6 py-3 text-left">Country</th>
                  <th className="px-6 py-3 text-left">State</th>
                  <th className="px-6 py-3 text-left">Total</th>

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
                    <td className="px-6 py-3">{menu.vendorId?.vendorName}</td>
                    <td className="px-6 py-3">{formatDate(menu.poDate)}</td>
                    <td className="px-6 py-3">{menu.finYear}</td>
                    <td className="px-6 py-3">{menu.country.name}</td>
                    <td className="px-6 py-3">{menu.state.name}</td>
                    <td className="px-6 py-3">{menu.grandTotal}</td>

                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        className=" px-2 py-1 bg-black text-white rounded-2xl"
                        onClick={() =>
                          navigate(`/inventory/update-grn/${menu._id}`)
                        }
                      >
                        <SquarePen />
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
