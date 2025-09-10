import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function SalesCreation() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    saleNo: "",
    customerName: "",
    reqDate: new Date().toISOString().split("T")[0],
    finYear: "",
    address: "",
    inStockQty: "",
    itemRate: "",
    items: [],
    grandTotal: "",
    createdBy: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const [orderItems, setOrderItems] = useState([]);
  const [stoksItems, setStoksItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();
  // Fetch vendors, countries, items (same as creation)

  // Generate random GRN No with prefix GRN-
  useEffect(() => {
    const randomNo = Math.floor(100 + Math.random() * 900); // random 3-digit
    setFormData((prev) => ({ ...prev, saleNo: `Sl-${randomNo}` }));
  }, []);

  // inside handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "itemId") {
      // Find the selected stock item
      const selectedItem = stoksItems.find((s) => s.itemId._id === value);
      if (selectedItem) {
        setFormData((prev) => ({
          ...prev,
          itemId: value,
          inStockQty: selectedItem.receivedQty || 0, // set InStock
          itemRate: selectedItem.saleRate || 0, // FIX: use saleRate
          itemQty: "",
          itemAmt: "",
        }));
      }
    } else if (name === "itemQty") {
      const qty = parseFloat(value) || 0;
      const inStock = parseFloat(formData.inStockQty) || 0;
      const rate = parseFloat(formData.itemRate) || 0;

      if (qty > inStock) {
        toast.error("Quantity cannot be greater than In Stock quantity!");
        return;
      }

      const amt = qty && rate ? qty * rate : "";

      setFormData((prev) => ({
        ...prev,
        itemQty: value,
        itemAmt: amt,
      }));
    } else if (name === "itemRate") {
      const rate = parseFloat(value) || 0;
      const qty = parseFloat(formData.itemQty) || 0;
      const amt = qty && rate ? qty * rate : "";

      setFormData((prev) => ({
        ...prev,
        itemRate: value,
        itemAmt: amt,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.saleNo) errors.saleNo = "Order No. is required";
    if (!formData.customerName)
      errors.customerName = "Customer Name is required";
    if (!formData.poDate) errors.poDate = "Please Select Date";
    if (!formData.finYear) errors.finYear = "Please Select Financial Year";
    if (!formData.address) errors.address = "Address is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  
  const grandTotal = orderItems.reduce(
    (sum, item) => sum + parseFloat(item.itemAmt || 0),
    0
  );

  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await api.get("/grn/all-stocks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setStoksItems(res.data.stocks);
          console.log("The data is", res.data.stocks);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getItems();
  }, []);

  // Add or edit row
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!formData.itemId || !formData.itemQty || !formData.itemRate) {
      toast.error("Please select item and enter qty");
      return;
    }

    // FIX: use stoksItems instead of items
    const selectedItem = stoksItems.find(
      (s) => s.itemId._id === formData.itemId
    );

    const newRow = {
      itemId: formData.itemId,
      itemName: selectedItem?.itemId?.itemName || "",
      itemQty: formData.itemQty,
      itemRate: formData.itemRate,
      itemAmt: formData.itemAmt,
    };

    if (editIndex !== null) {
      // Update existing row
      const updated = [...orderItems];
      updated[editIndex] = newRow;
      setOrderItems(updated);
      setEditIndex(null);
    } else {
      // Add new row
      setOrderItems([...orderItems, newRow]);
    }

    // Reset fields for next entry
    setFormData((prev) => ({
      ...prev,
      itemId: "",
      itemQty: "",
      itemRate: "",
      itemAmt: "",
    }));
  };

  const handleDelete = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const row = orderItems[index];
    setFormData((prev) => ({
      ...prev,
      itemId: row.itemId,
      itemQty: row.itemQty,
      itemRate: row.itemRate,
      itemAmt: row.itemAmt,
    }));
    setEditIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.customerName ||
      !formData.address ||
      orderItems.length === 0
    ) {
      toast.error("Please fill all fields and add at least one item");
      return;
    }
    try {
      const payload = {
        saleNo: formData.saleNo,
        reqDate: formData.reqDate,
        finYear: formData.finYear,
        customerName: formData.customerName,
        address: formData.address,
        items: orderItems, // all added items
        grandTotal: grandTotal,
        createdBy: user?._id, // from AuthContext
      };

      const res = await api.post("/sales/create-sale", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success("Sale saved successfully!");
        // Reset form after save
        setFormData({
          saleNo: "",
          reqDate: "",
          finYear: "",
          customerName: "",
          address: "",
          itemId: "",
          itemQty: "",
          itemRate: "",
          itemAmt: "",
        });
        setOrderItems([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error saving sale");
    }
  };

  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black mx-[50px]">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>Sales Order</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-[50px] mb-5">
            <div>
              <label className="block text-sm font-bold mb-1">Order No.</label>
              <input
                type="text"
                name="saleNo"
                value={formData.saleNo}
                onChange={handleChange}
                placeholder="e.g.,Order Number"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {formErrors.saleNo && (
                <p className="text-red-500 text-xs">{formErrors.saleNo}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g.,Customer Name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {formErrors.customerName && (
                <p className="text-red-500 text-xs">
                  {formErrors.customerName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Date</label>
              <input
                type="date"
                name="reqDate"
                value={formData.reqDate}
                onChange={handleChange}
                placeholder="e.g., Enter Date"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {formErrors.reqDate && (
                <p className="text-red-500 text-xs">{formErrors.reqDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                Financial Year
              </label>

              <select
                name="finYear"
                value={formData.finYear}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Financial Year</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
                <option value="2027-28">2027-28</option>
                <option value="2029-30">2029-30</option>
              </select>
              {formErrors.finYear && (
                <p className="text-red-500 text-xs">{formErrors.finYear}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5 mb-5  mx-[50px]">
            {/* Address 1 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900">
                Address *
              </label>
              <textarea
                placeholder="Enter Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 mb-1 h-full p-2 block w-full border border-gray-300 rounded-md"
              ></textarea>
              {formErrors.address && (
                <p className="text-red-400 text-sm">{formErrors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                InStock
              </label>
              <input
                type="text"
                name="inStockQty"
                value={formData.inStockQty || ""}
                onChange={handleChange}
                readOnly
                placeholder="e.g., Stock Quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>

          {/* Your form fields above remain same */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-[50px] mb-5 mt-10">
            <div>
              <label className="block text-sm font-bold mb-1">Item Name</label>
              <select
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Item</option>
                {stoksItems?.map((c) => (
                  <option key={c.itemId._id} value={c.itemId._id}>
                    {c.itemId.itemName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Quantity</label>
              <input
                type="number"
                name="itemQty"
                value={formData.itemQty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Rate</label>
              <input
                type="number"
                name="itemRate"
                value={formData.itemRate || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Amount</label>
              <input
                type="number"
                name="itemAmt"
                value={formData.itemAmt}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div className="col-span-full flex justify-end">
              <button
                className="px-4 py-2 rounded text-white bg-black"
                type="button"
                onClick={handleAddItem}
              >
                {editIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
          <div className="hidden">{user._id}</div>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Item Name</th>
                  <th className="px-6 py-3 text-left">Qty</th>
                  <th className="px-6 py-3 text-left">Rate</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 text-gray-700"
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{row.itemName}</td>
                    <td className="px-6 py-3">{row.itemQty}</td>
                    <td className="px-6 py-3">{row.itemRate}</td>
                    <td className="px-6 py-3">{row.itemAmt}</td>
                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-600"
                      >
                        <FaTrash />
                      </button>

                      
                    </td>
                  </tr>
                ))}
                {orderItems.length > 0 && (
                  <tr className="font-bold bg-gray-100">
                    <td colSpan="4" className="p-2 border text-right">
                      Grand Total
                    </td>
                    <td className="p-2 border">{grandTotal}</td>
                    <td className="p-2 border"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end items-end gap-2 mx-[50px] mt-5">
            <button className="px-4 py-2 rounded text-white bg-black">
              Submit
            </button>
            <Link
              className="px-4 py-2 rounded text-white bg-black"
              to="/sales/sales-list"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
