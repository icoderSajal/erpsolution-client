import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function PurchaseOrderCreation() {
  const [formData, setFormData] = useState({
    orderNo: "",
    vendorId: "",
    poDate: "",
    finYear: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    items: [],
    grandTotal: "",
    createdBy: "",
    poStatus: "",
  });

  const { user } = useAuth();
  const [formErrors, setFormErrors] = useState({});
  const [vendors, setVendors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [items, setItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();
  // Fetch vendors, countries, items (same as creation)
  useEffect(() => {
    api.get("/local/countries").then((res) => setCountries(res.data.countries));

    api
      .get("/admin/getvendors", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => res.data.success && setVendors(res.data.vendors));

    api
      .get("/inventory/get-allitems", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => res.data.success && setItems(res.data.items));
  }, []);
  // Generate random GRN No with prefix GRN-
  useEffect(() => {
    const randomNo = Math.floor(100 + Math.random() * 900); // random 3-digit
    setFormData((prev) => ({ ...prev, orderNo: `PO-${randomNo}` }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "itemQty" || name === "itemRate") {
      const qty = name === "itemQty" ? value : formData.itemQty;
      const rate = name === "itemRate" ? value : formData.itemRate;
      const amt = qty && rate ? parseFloat(qty) * parseFloat(rate) : "";
      setFormData((prev) => ({ ...prev, [name]: value, itemAmt: amt }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.orderNo) errors.orderNo = "Order No. is required";
    if (!formData.vendorId) errors.vendorId = "Please Select  Vendor";
    if (!formData.poDate) errors.poDate = "Please Select Date";
    if (!formData.finYear) errors.finYear = "Please Select Financial Year";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.pin) errors.pin = "Please Select Pincode";
    if (!formData.country) errors.country = "Please Select  Country";

    if (!formData.state) errors.state = "Please Select  State";
    if (!formData.city) errors.city = "Please Select  City";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch states when country changes
  useEffect(() => {
    if (formData.country) {
      api
        .get(`/local/states/${formData.country}`)
        .then((res) => setStates(res.data.states));
    }
  }, [formData.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.state) {
      api
        .get(`/local/cities/${formData.state}`)
        .then((res) => setCities(res.data.cities));
    }
  }, [formData.state]);

  // Auto-fill rate when item selected
  useEffect(() => {
    if (formData.itemId) {
      const selectedItem = items.find((i) => i._id === formData.itemId);
      if (selectedItem) {
        setFormData((prev) => ({
          ...prev,
          itemRate: selectedItem.mainRate,
          itemAmt: prev.itemQty ? prev.itemQty * selectedItem.mainRate : "",
        }));
      }
    }
  }, [formData.itemId, items]);

  // Add or edit row
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!formData.itemId || !formData.itemQty || !formData.itemRate) {
      toast.error("Please select item and enter qty");
      return;
    }
    const selectedItem = items.find((i) => i._id === formData.itemId);
    const newRow = {
      itemId: formData.itemId,
      itemName: selectedItem?.itemName || "",
      itemQty: formData.itemQty,
      itemRate: formData.itemRate,
      itemAmt: formData.itemAmt,
    };
    if (editIndex !== null) {
      const updated = [...orderItems];
      updated[editIndex] = newRow;
      setOrderItems(updated);
      setEditIndex(null);
    } else {
      setOrderItems([...orderItems, newRow]);
    }
    setFormData((prev) => ({
      ...prev,
      itemId: "",
      itemQty: "",
      itemRate: "",
      itemAmt: "",
    }));
  };

  const handleDelete = (index) =>
    setOrderItems(orderItems.filter((_, i) => i !== index));
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

  const grandTotal = orderItems.reduce(
    (sum, item) => sum + parseFloat(item.itemAmt || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...formData,
      createdBy: user?._id,
      items: orderItems,
      grandTotal,
    };

    try {
      const response = await api.post("/purchase/create-po", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        toast.success("Purchase Order created ");
        navigate("/purchase/purchase-order");
      }
    } catch (error) {
      toast.error("Error to create Purchase Order ");
    }
  };

  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black mx-[50px]">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>Purchase Order</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-[50px] mb-5">
            <div>
              <label className="block text-sm font-bold mb-1">Order No.</label>
              <input
                type="text"
                name="orderNo"
                value={formData.orderNo}
                onChange={handleChange}
                placeholder="e.g.,Order Number"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {formErrors.orderNo && (
                <p className="text-red-500 text-xs">{formErrors.orderNo}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Vendor</label>
              <select
                name="vendorId"
                value={formData.vendorId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Vendor</option>
                {vendors?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.vendorName}
                  </option>
                ))}
              </select>
              {formErrors.vendorId && (
                <p className="text-red-500 text-xs">{formErrors.vendorId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Date</label>
              <input
                type="date"
                name="poDate"
                value={formData.poDate}
                onChange={handleChange}
                placeholder="e.g., Enter Date"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {formErrors.poDate && (
                <p className="text-red-500 text-xs">{formErrors.poDate}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5  mx-[50px]">
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

            <div className="row-span-2">
              {/* Country */}

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-950">
                  Country *
                </label>

                <select
                  name="country"
                  onChange={handleChange}
                  value={formData.country}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                >
                  <option className="bg-gray-400" value="">
                    Select Country
                  </option>
                  {countries.map((c) => (
                    <option className="bg-gray-400" key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {formErrors.country && (
                  <p className="text-red-400 text-sm">{formErrors.country}</p>
                )}
              </div>

              {/* City */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-950">
                  City *
                </label>

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                >
                  <option className="bg-gray-400" value="">
                    Select City
                  </option>
                  {cities.map((c) => (
                    <option className="bg-gray-400" key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {formErrors.city && (
                  <p className="text-red-400 text-sm">{formErrors.city}</p>
                )}
              </div>
            </div>

            <div className="row-span-2">
              {/* State */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-950">
                  State *
                </label>

                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                >
                  <option className="bg-gray-400" value="">
                    Select State
                  </option>
                  {states.map((s) => (
                    <option className="bg-gray-400" key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {formErrors.state && (
                  <p className="text-red-400 text-sm">{formErrors.state}</p>
                )}
              </div>

              {/* PIN */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-950">
                  Pincode *
                </label>
                <input
                  placeholder="Enter Pincode"
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
                {formErrors.pin && (
                  <p className="text-red-400 text-sm">{formErrors.pin}</p>
                )}
              </div>
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
                {items?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.itemName}
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
                value={formData.itemRate}
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
              to="/purchase/purchase-order"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
