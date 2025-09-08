import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../api/axios";

export default function UpdateGoodReciptNote() {
  const { id } = useParams(); // get PO id from URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    orderNo: "",
    vendorId: "",
    poDate: new Date().toISOString().split("T")[0],
    finYear: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    itemId: "",
    itemQty: "",
    itemRate: "",
    itemAmt: "",
  });

  const [errors, setErrors] = useState({});
  const [vendors, setVendors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [items, setItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

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

  // Fetch existing purchase order
  useEffect(() => {
    const fetchPO = async () => {
      try {
        const res = await api.get(`/purchase/getsingleepurchase/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          const po = res.data.order;
          setFormData({
            orderNo: po.orderNo,
            vendorId: po.vendorId?._id || "",
            poDate: new Date(po.poDate).toISOString().split("T")[0],
            finYear: po.finYear,
            address: po.address,
            country: po.country?._id,
            state: po.state?._id,
            city: po.city?._id,
            pin: po.pin,
            itemId: "",
            itemQty: "",
            itemRate: "",
            itemAmt: "",
          });
          setOrderItems(po.items || []);
        }
      } catch (err) {
        toast.error("Failed to fetch purchase order");
      }
    };
    fetchPO();
  }, [id]);

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

  // Handle input changes
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

  const handleEdit = (index, e) => {
    e.preventDefault();
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

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        createdBy: user?._id,
        items: orderItems,
        grandTotal,
      };
      const res = await api.put(`/purchase/update-po/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        toast.success("Purchase Order updated successfully");
        navigate("/purchase/purchase-order");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black mx-[50px]">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1> Goods Receipt Note</h1>
        </div>
        <form>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-[50px] mb-5">
            <div>
              <label className="block text-sm font-bold mb-1">Order No.</label>
              <input
                type="text"
                name="orderNo"
                value={formData.orderNo}
                onChange={handleChange}
                placeholder="e.g.,Order Number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.orderNo && (
                <p className="text-red-500 text-xs">{errors.orderNo}</p>
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
              {errors.vendorId && (
                <p className="text-red-500 text-xs">{errors.vendorId}</p>
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
              {errors.poDate && (
                <p className="text-red-500 text-xs">{errors.poDate}</p>
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
              {errors.finYear && (
                <p className="text-red-500 text-xs">{errors.finYear}</p>
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
              {errors.address && (
                <p className="text-red-400 text-sm">{errors.address}</p>
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
                {errors.country && (
                  <p className="text-red-400 text-sm">{errors.country}</p>
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
                {errors.city && (
                  <p className="text-red-400 text-sm">{errors.city}</p>
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

                {errors.state && (
                  <p className="text-red-400 text-sm">{errors.state}</p>
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
                {errors.pin && (
                  <p className="text-red-400 text-sm">{errors.pin}</p>
                )}
              </div>
            </div>
          </div>

          {/* Your form fields above remain same */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-[50px] mb-5">
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
                onClick={handleAddItem}
                className="px-4 py-2 rounded text-white bg-black"
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
              Update
            </button>
            <Link
              className="px-4 py-2 rounded text-white bg-black"
              to="/inventory/grn-list"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
