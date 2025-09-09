import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { FaEdit } from "react-icons/fa";
export default function GoodReciptNoteCreation() {
  const [formData, setFormData] = useState({
    grnNo: "",
    poID: "",
    grnDate: "",
    finyear: "",
  });
  const [orders, setOrders] = useState([]);
  const [poorder, setpoOrder] = useState({
    orderNo: "",
    vendorId: "",
    poDate: new Date().toISOString().split("T")[0],
    finYear: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    items: [],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  //get Puchase Order
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/purchase/getapprovedpurchase", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch {
        toast.error("Failed to fetch menus");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(
          `/purchase/getsingleepurchase/${formData.poID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const po = response.data.order;
          //alert(company);
          setpoOrder((prev) => ({
            ...prev,
            orderNo: po?.orderNo,
            vendorId: po?.vendorId,
            poDate: po?.poDate,
            finYear: po?.finYear,
            address: po?.address,
            country: po?.country,
            state: po?.state,
            city: po?.city,
            pin: po?.pin,
            grandTotal: po?.grandTotal,
            items: po?.items,
          }));
        } else {
          toast.error("Failed to fetch data.");
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          //toast.error("An error occurred while fetching data.");
        }
      }
    };

    fetchItem();
  }, [formData.poID]);

  return (
    <>
      <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
          Goods Receipt Note
        </h1>

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
                  {r._id}
                </option>
              ))}
            </select>
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
          </div>
          <div className="">
            <label className="block text-sm font-medium text-white">
              Financial Year<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mrnNo"
              value={formData.finyear}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-200 text-black"
            />
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
                Item Id<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
                placeholder="Item Id"
                className="mt-1 p-2 w-full block border border-gray-300 rounded-md bg-gray-200 text-black"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-white">
                Item Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Item Name"
                className="mt-1 p-2 w-full block border border-gray-300 rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                PO Quantity<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemQty"
                value={formData.itemQty}
                onChange={handleChange}
                placeholder="Purchase Quantity"
                className="mt-1 p-2 w-full block border border-gray-300 rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Received Quantity<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemQty"
                value={formData.itemQty}
                onChange={handleChange}
                placeholder="Received Quantity"
                className="mt-1 p-2 w-full block border border-gray-300 rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Selling Rate<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemQty"
                value={formData.itemQty}
                onChange={handleChange}
                placeholder="Selling Rate"
                className="mt-1 p-2 w-full block border border-gray-300 rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Amount<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemQty"
                value={formData.itemQty}
                onChange={handleChange}
                placeholder="Amount"
                className="mt-1 p-2 w-full block border border-gray-300 rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Grand Amount<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="itemQty"
                value={formData.itemQty}
                onChange={handleChange}
                placeholder="Total Amount"
                className="mt-1 p-2 w-full block border border-gray-300 rounded-md bg-gray-200 text-black"
              />
            </div>
            <div>
              <button
                type="button"
                className="px-8 py-2 bg-white mt-6 rounded-xl font-bold hover:bg-gray-950 hover:text-white hover:ring-1"
              >
                Add
              </button>
            </div>
          </div>

          <table className="w-full mt-4 border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border p-2 ">#</th>
                <th className="border p-2 text-left">Item Name</th>
                <th className="border p-2 text-left">PO Qty</th>
                <th className="border p-2 text-left">PO Rate</th>
                <th className="border p-2 text-left">Amount</th>
                <th className="border p-2 text-left">Received Qty</th>

                <th className="border p-2 text-left">Sell Rate</th>

                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {poorder.items.map((item, i) => (
                <>
                  <tr key={item.itemId._id} className="text-white">
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{item.itemName}</td>
                    <td className="border p-2">{item.itemQty}</td>
                    <td className="border p-2">₹{item.itemRate}</td>
                    <td className="border p-2">₹{item.itemAmt}</td>
                    <td className="border p-2"></td>

                    <td className="border p-2"></td>
                    <td className="border p-2 flex gap-3">
                      <button className="text-white">
                        <FaEdit size={20} />
                      </button>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
