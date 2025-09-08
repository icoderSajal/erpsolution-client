import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { View, SquarePen, Trash, CheckCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PurchaseOrderList() {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null); // selected order for status change
  const [newStatus, setNewStatus] = useState(""); // track updated status

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await api.get("/purchase/getallpurchase", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setMenus(response.data.orders);
        setFilteredMenus(response.data.orders);
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

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    try {
      const response = await api.put(
        `/purchase/update-status/${selectedOrder._id}`,
        { poStatus: 1 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setMenus((prev) =>
          prev.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, poStatus: newStatus }
              : order
          )
        );
        toast.success("Status updated successfully!");
        setSelectedOrder(null);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  return (
    <>
      <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
          Purchase Order List
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
              onClick={() => navigate("/purchase/create-purchase-order")}
              className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-950 hover:ring-1 transition-all"
            >
              + Add
            </button>
            <button
              onClick={() => navigate("/purchase")}
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
                    <td className="px-6 py-3">{menu.vendorId?.vendorName}</td>
                    <td className="px-6 py-3">{formatDate(menu.poDate)}</td>
                    <td className="px-6 py-3">{menu.finYear}</td>
                    <td className="px-6 py-3">{menu.country.name}</td>
                    <td className="px-6 py-3">{menu.state.name}</td>
                    <td className="px-6 py-3">{menu.grandTotal}</td>
                    <td className="px-6 py-3 text-left">
                      {menu.poStatus === 0 ? "Pending" : "Approved"}
                    </td>

                    <td className="px-6 py-4 text-center space-x-3">
                      {menu.poStatus === 0 ? (
                        // Pending → Show Approve, View, Edit
                        <>
                          {/* Edit */}
                          <div className="relative inline-block group">
                            <button
                              className="px-2 py-1 bg-black text-white rounded-2xl"
                              onClick={() =>
                                navigate(
                                  `/purchase/edit-purchase-order/${menu._id}`
                                )
                              }
                            >
                              <SquarePen />
                            </button>
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition">
                              Edit
                            </span>
                          </div>
                          {/* Approve */}
                          <div className="relative inline-block group">
                            <button
                              className="px-2 py-1 bg-black text-white rounded-2xl"
                              onClick={() => {
                                setSelectedOrder(menu);
                                setNewStatus(menu.poStatus);
                              }}
                            >
                              <CheckCheck />
                            </button>
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition">
                              Approve
                            </span>
                          </div>

                          {/* View */}
                          <div className="relative inline-block group">
                            <button
                              className="px-2 py-1 bg-black text-white rounded-2xl"
                              onClick={() =>
                                navigate(
                                  `/purchase/view-purchase-order/${menu._id}`
                                )
                              }
                            >
                              <View />
                            </button>
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition">
                              View
                            </span>
                          </div>
                        </>
                      ) : (
                        // Approved → Only show View
                        <div className="relative inline-block group">
                          <button
                            className="px-2 py-1 bg-black text-white rounded-2xl"
                            onClick={() =>
                              navigate(
                                `/purchase/view-purchase-order/${menu._id}`
                              )
                            }
                          >
                            <View />
                          </button>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition">
                            View
                          </span>
                        </div>
                      )}
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
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Update Status</h2>
                <button onClick={() => setSelectedOrder(null)}>
                  <X />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value={1}>Approved</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
