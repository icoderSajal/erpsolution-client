import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function GoodReciptNoteCreation() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    grnNo: "",
    poID: "",
    grnDate: new Date().toISOString().split("T")[0],
    finyear: "",
    items: [],
    grandAmount: 0,
    createdBy: user?._id || "",
  });

  const [orders, setOrders] = useState([]);
  const [poorder, setPoOrder] = useState({ items: [] });
  const [editIndex, setEditIndex] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.grnNo) errors.grnNo = "GRN No. is required";
    if (!formData.poID) errors.poID = "Select Purchase Order";
    if (!formData.grnDate) errors.grnDate = "Select Date";
    if (!formData.finyear) errors.finyear = "Select Financial Year";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate random GRN No
  useEffect(() => {
    const randomNo = Math.floor(100 + Math.random() * 900);
    setFormData((prev) => ({ ...prev, grnNo: `GRN-${randomNo}` }));
  }, []);

  // Fetch Purchase Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/purchase/getapprovedpurchase", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) setOrders(res.data.orders);
      } catch {
        toast.error("Failed to fetch Purchase Orders");
      }
    };
    fetchOrders();
  }, []);

  // Fetch Selected Purchase Order
  useEffect(() => {
    if (!formData.poID) return;
    const fetchPo = async () => {
      try {
        const res = await api.get(
          `/purchase/getsingleepurchase/${formData.poID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setPoOrder(res.data.order);
          setFormData((prev) => ({
            ...prev,
            grandAmount: res.data.order.grandTotal,
          }));
        }
      } catch {
        toast.error("Failed to fetch PO details");
      }
    };
    fetchPo();
  }, [formData.poID]);

  // Handle Edit
  const handleEdit = (item, index) => {
    setFormData((prev) => ({
      ...prev,
      itemId: item.itemId?._id || "",
      itemName: item.itemName || "",
      itemQty: item.itemQty || "",
      receivedQty: item.receivedQty || "",
      sellRate: item.sellRate || "",
      amount: item.itemAmt || "",
    }));
    setEditIndex(index);
  };

  // Handle Update Item
  const handleUpdate = () => {
    if (editIndex === null) return;

    const updatedItems = [...poorder.items];
    updatedItems[editIndex] = {
      ...updatedItems[editIndex],
      itemId: formData.itemId,
      itemName: formData.itemName,
      itemQty: formData.itemQty,
      receivedQty: formData.receivedQty,
      sellRate: formData.sellRate,
      amount: formData.amount,
    };

    setPoOrder((prev) => ({ ...prev, items: updatedItems }));
    setFormData((prev) => ({
      ...prev,
      itemId: "",
      itemName: "",
      itemQty: "",
      receivedQty: "",
      sellRate: "",
      amount: "",
    }));
    setEditIndex(null);

    toast.success("Item updated");
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...formData,
      items: poorder.items.map((item) => ({
        itemId: item.itemId?._id || item.itemId,
        itemName: item.itemName,
        itemQty: item.itemQty,
        receivedQty: item.receivedQty || 0,
        sellRate: item.sellRate || 0,
        amount: item.itemAmt || item.amount,
      })),
      grandAmount: poorder.grandTotal || formData.grandAmount,
    };

    try {
      const res = await api.post("/grn/create", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        toast.success("GRN created successfully!");
        setFormData({
          grnNo: "",
          poID: "",
          grnDate: new Date().toISOString().split("T")[0],
          finyear: "",
          items: [],
          grandAmount: 0,
          createdBy: user?._id || "",
        });
        setPoOrder({ items: [] });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("GRN Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to save GRN");
    }
  };

  return (
    <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
        Goods Receipt Note
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-1 p-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white">
              GRN No<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="grnNo"
              value={formData.grnNo}
              onChange={handleChange}
              className="mt-1 p-2 w-full block border border-gray-300 rounded-md bg-gray-200 text-black"
            />
            {formErrors.grnNo && (
              <p className="text-red-400 text-sm">{formErrors.grnNo}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-white">
              Purchase Order<span className="text-red-500">*</span>
            </label>
            <select
              name="poID"
              onChange={handleChange}
              className="mt-1 p-2 w-full block border border-gray-300 rounded-md bg-gray-200 text-black"
            >
              <option value="" className="bg-gray-400">
                Select PO
              </option>
              {orders.map((r) => (
                <option className="bg-gray-400" key={r._id} value={r._id}>
                  {r.vendorId?.vendorName}-{r._id}
                </option>
              ))}
            </select>
            {formErrors.poID && (
              <p className="text-red-400 text-sm">{formErrors.poID}</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-medium text-white">
              Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="grnDate"
              value={formData.grnDate}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-200 text-black"
            />
            {formErrors.grnDate && (
              <p className="text-red-400 text-sm">{formErrors.grnDate}</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-medium text-white">
              Financial Year<span className="text-red-500">*</span>
            </label>
            <select
              name="finyear"
              value={formData.finyear}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-200 text-black"
            >
              <option value="">Select FinYear</option>
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
              <option value="2027-28">2027-28</option>
              <option value="2028-29">2028-29</option>
              <option value="2029-30">2029-30</option>
            </select>
            {formErrors.finyear && (
              <p className="text-red-400 text-sm">{formErrors.finyear}</p>
            )}
          </div>
        </div>
        <hr className="text-white h-2.5" />
        {/* table */}
        <div className="overflow-x-auto  shadow rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
            Item Details
          </h1>

          <div className="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-1 p-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-white">
                Item Id
              </label>
              <input
                type="text"
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
                placeholder="Item Id"
                className="mt-1 p-2 w-full border rounded-md bg-gray-200 text-black"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-white">
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Item Name"
                className="mt-1 p-2 w-full border rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                PO Quantity
              </label>
              <input
                type="text"
                name="itemQty"
                value={formData.itemQty}
                onChange={handleChange}
                placeholder="Purchase Quantity"
                className="mt-1 p-2 w-full border rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Received Qty
              </label>
              <input
                type="text"
                name="receivedQty"
                value={formData.receivedQty}
                onChange={handleChange}
                placeholder="Received Quantity"
                className="mt-1 p-2 w-full border rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Selling Rate
              </label>
              <input
                type="text"
                name="sellRate"
                value={formData.sellRate}
                onChange={handleChange}
                placeholder="Selling Rate"
                className="mt-1 p-2 w-full border rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Amount
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Amount"
                className="mt-1 p-2 w-full border rounded-md bg-gray-200 text-black"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleUpdate}
                className="px-8 py-2 bg-white mt-6 rounded-xl font-bold hover:bg-gray-950 hover:text-white hover:ring-1"
              >
                {editIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mt-4 border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border p-2">#</th>
                <th className="border p-2">Item Name</th>
                <th className="border p-2">PO Qty</th>
                <th className="border p-2">PO Rate</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Received Qty</th>
                <th className="border p-2">Sell Rate</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {poorder.items.map((item, i) => (
                <tr key={i} className="text-white">
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.itemQty}</td>
                  <td className="border p-2">₹{item.itemRate}</td>
                  <td className="border p-2">₹{item.itemAmt}</td>
                  <td className="border p-2">{item.receivedQty || "-"}</td>
                  <td className="border p-2">{item.sellRate || "-"}</td>
                  <td className="border p-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(item, i)}
                      className="text-white"
                    >
                      <FaEdit size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-5 justify-end mb-5 mr-5">
          <button
            type="submit"
            className="px-8 py-2 bg-white mt-6 rounded-md font-bold hover:bg-gray-950 hover:text-white hover:ring-1"
          >
            Submit
          </button>
          <Link
            to="/inventory/grn-list"
            className="px-8 py-2 bg-white mt-6 rounded-md font-bold hover:bg-gray-950 hover:text-white hover:ring-1"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
