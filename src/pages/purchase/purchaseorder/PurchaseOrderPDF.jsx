import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import api from "../../../api/axios"; // adjust the path to your axios instance
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeftCircle, Download, PrinterCheck } from "lucide-react";
import { useRef } from "react";
import bg from "../../../assets/bg.png";

import { useReactToPrint } from "react-to-print";
export default function PurchaseOrderView() {
  const [order, setOrder] = useState(null);
  const [company, setCompany] = useState([]);
  const contentRef = useRef();
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const response = await api.get("/admin/getcompanies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setCompany(response.data.companies);
      }
    } catch {
      toast.error("Failed to fetch menus");
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/purchase/getsingleepurchase/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          const po = response.data.order;
          //alert(company);
          setOrder((prev) => ({
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
          toast.error("An error occurred while fetching data.");
        }
      }
    };

    fetchItem();
    fetchData();
  }, [id]);

  const downloadPDF = () => {
    if (!order) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Purchase Order", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order No: ${order.orderNo}`, 14, 30);
    doc.text(`PO Date: ${new Date(order.poDate).toLocaleDateString()}`, 14, 38);
    doc.text(`Financial Year: ${order.finYear}`, 14, 46);
    doc.text(`Vendor: ${order.vendorId.vendorName}`, 14, 54);
    doc.text(`Address: ${order.address}`, 14, 62);
    doc.text(
      `Location: ${order.city.name}, ${order.state.name}, ${order.country.name}`,
      14,
      70
    );
    doc.text(`PIN: ${order.pin}`, 14, 78);

    // Table for items
    const tableData = order.items.map((item, i) => [
      i + 1,
      item.itemName,
      item.itemQty,
      item.itemRate,
      item.itemAmt,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["#", "Item Name", "Qty", "Rate", "Amount"]],
      body: tableData,
    });

    // Grand Total
    let finalY = doc.lastAutoTable?.finalY || 90;
    doc.text(`Grand Total: ₹${order.grandTotal}`, 14, finalY + 10);

    doc.save(`PurchaseOrder_${order.orderNo}.pdf`);
  };

  const reactToPrintFn = useReactToPrint({ contentRef });
  if (!order) {
    return <p className="p-6">Loading order...</p>;
  }

  return (
    <>
      <div className="p-6 text-white bg-gray-400" ref={contentRef}>
        <h1 className="text-xl font-bold mb-4">Purchase Order</h1>
        <div className="flex justify-between items-center gap-2">
          <div className="bg-red-400">
            <img src={bg} alt="logo" height={100} width={100} />
          </div>
          <div className="">
            {company.length > 0 ? (
              company.map((c) => (
                <>
                  <div className="flex justify-evenly items-center gap-2">
                    <div className="p-4 ">
                      <h1 className="text-2xl font-bold">{c.companyName}</h1>
                      <p className="text-right font-semibold text-xl">
                        {c.address1} {c.address2}
                      </p>

                      <p className="text-right font-semibold text-xl"></p>
                      <p className="text-right font-semibold text-xl">
                        {c.city?.name} {c.state?.name}
                      </p>
                      <p className="text-right font-semibold text-xl">
                        {c.pin}
                      </p>
                      <p className="text-right font-semibold text-xl">
                        {c.gstNumber}
                      </p>
                    </div>
                  </div>
                </>
              ))
            ) : (
              <>
                <h1>No Data Found</h1>
              </>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold text-lg mb-2">
            Order No: {order.orderNo}
          </h2>
          <p>Date: {new Date(order.poDate).toLocaleDateString()}</p>
          <p>Financial Year: {order.finYear}</p>
          <p>Vendor: {order.vendorId.vendorName}</p>
          <p>
            Delivery Address: {order.address}, {order.city.name},{" "}
            {order.state.name}, {order.country.name} - {order.pin}
          </p>

          <table className="w-full mt-4 border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border p-2">#</th>
                <th className="border p-2">Item Name</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Rate</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item.itemId._id}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.itemQty}</td>
                  <td className="border p-2">₹{item.itemRate}</td>
                  <td className="border p-2">₹{item.itemAmt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-2 font-semibold">Grand Total: ₹{order.grandTotal}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-5">
        <button
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg transition"
          onClick={reactToPrintFn}
        >
          <PrinterCheck /> Print PDF
        </button>

        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          <Download />
          Download PDF
        </button>
        <Link
          to="/purchase/purchase-order"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
        >
          <ChevronLeftCircle />
          Back
        </Link>
      </div>
    </>
  );
}
