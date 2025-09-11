import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useParams, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { ChevronLeftCircle, Download, PrinterCheck } from "lucide-react";

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

export default function SalesInvoice() {
  const [order, setOrder] = useState(null);
  const [companies, setCompanies] = useState([]);
  const contentRef = useRef();
  const { id } = useParams();

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/admin/getcompanies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch {
      toast.error("Failed to fetch company details");
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/sales/get-single/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const po = response.data.order;
        setOrder({
          saleNo: po?.saleNo,
          customerName: po?.customerName,
          reqDate: po?.reqDate,
          finYear: po?.finYear,
          address: po?.address,
          grandTotal: po?.grandTotal,
          items: po?.items,
        });
      } else {
        toast.error("Failed to fetch invoice data.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    }
  };

  const downloadPDF = () => {
    if (!order) return;

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // HEADER BAR
    doc.setFillColor(34, 197, 94); // green bar
    doc.rect(0, 0, pageWidth, 60, "F");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("INVOICE", 40, 38);

    // Company info (right side in header)
    if (companies.length > 0) {
      const comp = companies[0];
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(comp.companyName || "", pageWidth - 200, 20);
      doc.text(comp.address1 || "", pageWidth - 200, 35);
      doc.text(
        `${comp.city?.name || ""}, ${comp.state?.name || ""}`,
        pageWidth - 200,
        50
      );
    }

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Customer + Invoice details
    doc.setFontSize(12);
    doc.text("Billed To:", 40, 100);
    doc.setFont("helvetica", "bold");
    doc.text(order.customerName || "", 40, 115);
    doc.setFont("helvetica", "normal");
    doc.text(order.address || "", 40, 130);

    doc.text(`Invoice No: ${order.saleNo}`, pageWidth - 200, 100);
    doc.text(
      `Date: ${new Date(order.reqDate).toLocaleDateString()}`,
      pageWidth - 200,
      115
    );
    doc.text(`Financial Year: ${order.finYear}`, pageWidth - 200, 130);

    // TABLE
    const tableData = order.items.map((item, i) => [
      i + 1,
      item.itemName,
      item.itemQty,
      `₹${item.itemRate}`,
      `₹${item.itemAmt}`,
    ]);

    autoTable(doc, {
      startY: 160,
      head: [["#", "Item Name", "Qty", "Rate", "Amount"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [34, 197, 94], // green
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      styles: { fontSize: 10, valign: "middle" },
      columnStyles: {
        0: { halign: "center", cellWidth: 40 },
        1: { cellWidth: 200 },
        2: { halign: "center", cellWidth: 60 },
        3: { halign: "right", cellWidth: 80 },
        4: { halign: "right", cellWidth: 80 },
      },
    });

    // TOTALS BOX
    let finalY = doc.lastAutoTable.finalY + 20;
    const subtotal = order.items.reduce((acc, item) => acc + item.itemAmt, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth - 250, finalY, 200, 80, "F");

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, pageWidth - 240, finalY + 20);
    doc.text(`Tax (18%): ₹${tax.toFixed(2)}`, pageWidth - 240, finalY + 40);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ₹${total.toFixed(2)}`, pageWidth - 240, finalY + 65);

    // FOOTER
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for your business!", pageWidth / 2, finalY + 120, {
      align: "center",
    });
    doc.text("Payment is due within 10 days.", pageWidth / 2, finalY + 135, {
      align: "center",
    });

    // SAVE
    doc.save(`Invoice_${order.saleNo}.pdf`);
  };

  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    fetchCompanies();
    fetchOrder();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading invoice...</p>
      </div>
    );
  }

  // Calculate totals
  const subtotal = order.items.reduce((acc, item) => acc + item.itemAmt, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <>
      <div
        className=" bg-gray-100 flex items-center justify-center p-6"
        ref={contentRef}
      >
        <div className="bg-white w-full max-w-4xl shadow-lg rounded-xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
            <div className="text-right">
              {companies.map((comp) => (
                <div key={comp._id}>
                  <h2 className="text-xl font-semibold text-gray-700">
                    {comp.companyName}
                  </h2>
                  <p className="text-gray-500 text-sm">{comp.address1}</p>
                  <p className="text-gray-500 text-sm">{comp.address2}</p>
                  <p className="text-gray-500 text-sm">
                    {comp.city.name}, {comp.state.name}
                  </p>
                  <p className="text-gray-500 text-sm">{comp.mobileNumber}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice & Customer Details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Billed To:</p>
              <h3 className="font-semibold text-gray-700">
                {order.customerName}
              </h3>
              <p className="text-gray-500 text-sm">{order.address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Invoice No:</p>
              <p className="font-semibold text-gray-700">{order.saleNo}</p>
              <p className="text-sm text-gray-500">
                Date: {formatDate(order.reqDate)}
              </p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mt-4 border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border p-2">#</th>
                <th className="border p-2 text-left">Item Name</th>
                <th className="border p-2 text-left">Qty</th>
                <th className="border p-2 text-left">Rate</th>
                <th className="border p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item._id}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.itemQty}</td>
                  <td className="border p-2">{item.itemRate}</td>
                  <td className="border p-2">{item.itemAmt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-6 mt-4 p-6">
            <div className="w-1/3 mr-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tax (18%):</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p>Payment is due within 10 days.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-5 mb-20">
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
          to="/sales/sales-list"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
        >
          <ChevronLeftCircle />
          Back
        </Link>
      </div>
    </>
  );
}
