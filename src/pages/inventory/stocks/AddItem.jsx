import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios"; // your axios instance
import { useAuth } from "../../../contexts/AuthContext"; // assuming you store user info

export default function GoodReciptNoteCreation() {
  const { user } = useAuth(); // logged-in user

  const [formData, setFormData] = useState({
    grnNo: "",
    poID: "",
    grnDate: new Date().toISOString().split("T")[0], // default today
    finyear: "",
    items: [],
    grandAmount: 0,
    createdBy: user?._id || "",
  });

  // 👉 handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 👉 Add item row
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { itemId: "", itemName: "", itemQty: 0, sellRate: 0, amount: 0 },
      ],
    }));
  };

  // 👉 Handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    if (field === "itemQty" || field === "sellRate") {
      updatedItems[index].amount =
        updatedItems[index].itemQty * updatedItems[index].sellRate;
    }

    const grandAmount = updatedItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    setFormData((prev) => ({ ...prev, items: updatedItems, grandAmount }));
  };

  // 👉 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/grn/create", formData);

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
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("GRN Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to save GRN");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create GRN</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* GRN No */}
        <div>
          <label className="block font-medium">GRN No</label>
          <input
            type="text"
            name="grnNo"
            value={formData.grnNo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Purchase Order ID */}
        <div>
          <label className="block font-medium">PO ID</label>
          <input
            type="text"
            name="poID"
            value={formData.poID}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* GRN Date */}
        <div>
          <label className="block font-medium">GRN Date</label>
          <input
            type="date"
            name="grnDate"
            value={formData.grnDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Fin Year */}
        <div>
          <label className="block font-medium">Financial Year</label>
          <input
            type="text"
            name="finyear"
            value={formData.finyear}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Items */}
        <div>
          <h3 className="font-medium mb-2">Items</h3>
          {formData.items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
              <input
                type="text"
                placeholder="Item ID"
                value={item.itemId}
                onChange={(e) =>
                  handleItemChange(idx, "itemId", e.target.value)
                }
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) =>
                  handleItemChange(idx, "itemName", e.target.value)
                }
                className="border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.itemQty}
                onChange={(e) =>
                  handleItemChange(idx, "itemQty", Number(e.target.value))
                }
                className="border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.sellRate}
                onChange={(e) =>
                  handleItemChange(idx, "sellRate", Number(e.target.value))
                }
                className="border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Amount"
                value={item.amount}
                readOnly
                className="border rounded px-2 py-1 bg-gray-100"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>

        {/* Grand Total */}
        <div>
          <label className="block font-medium">Grand Total</label>
          <input
            type="number"
            name="grandAmount"
            value={formData.grandAmount}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          Save GRN
        </button>
      </form>
    </div>
  );
}
