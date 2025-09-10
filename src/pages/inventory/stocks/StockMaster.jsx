import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../api/axios";

export default function StockMaster() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);

  const fetchStockData = async () => {
    try {
      const response = await api.get("/grn/all-stocks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setStocks(response.data.stocks);
      }
    } catch (error) {
      toast.error("Failed to fetch permissions");
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <>
      <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
          Stock Master
        </h1>

        {/* Top controls */}

        <div className="flex justify-end-safe gap-3 mb-5">
          <button
            onClick={() => navigate("/inventory")}
            className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-950 hover:ring-1 transition-all"
          >
            Back
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
          {stocks.map((st) => (
            <div className="bg-black h-[300px] flex flex-col justify-center items-center text-white transition-all duration-700 hover:ring-1 rounded-2xl p-8">
              <h1 className="text-white text-xl p-4 font-bold text-center">
                {st.itemId?.itemName}
              </h1>
              <h1>PO Qty--{st.itemPOQty}</h1>
              <h1>InStock--{st.receivedQty}</h1>

              <p>Rate--{st.saleRate}</p>
              <p>Batch--{st.batchNo}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
