import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

export default function GoodReciptNoteCreation() {
  const [formData, setFormData] = useState({
    poNo: "",
    poID: "",
    poDate: "",
    finyear: "",
  });
  const [orders, setOrders] = useState([]);
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

          //alert(setMenus(response.data.orders));
        }
      } catch {
        toast.error("Failed to fetch menus");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
          Goods Receipt Note
        </h1>

        <div className="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-1 p-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white">
              PO No<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="poNo"
              value={formData.poNo}
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
              type="text"
              name="poDate"
              value={formData.poDate}
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
      </div>
    </>
  );
}
