// import { useEffect, useState } from "react";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
// import api from "../../../api/axios"; // adjust the path to your axios instance
// import { Link, useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import { ChevronLeftCircle, Download, PrinterCheck } from "lucide-react";
// import { useRef } from "react";
// import bg from "../../../assets/bg.png";

// import { useReactToPrint } from "react-to-print";
// export default function PurchaseOrderView() {
//   const [order, setOrder] = useState(null);
//   const [company, setCompany] = useState([]);
//   const contentRef = useRef();
//   const { id } = useParams();

//   const fetchData = async () => {
//     try {
//       const response = await api.get("/admin/getcompanies", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       if (response.data.success) {
//         setCompany(response.data.companies);
//       }
//     } catch {
//       toast.error("Failed to fetch menus");
//     }
//   };

//   useEffect(() => {
//     const fetchItem = async () => {
//       try {
//         const response = await api.get(`/purchase/getsingleepurchase/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         if (response.data.success) {
//           const po = response.data.order;
//           //alert(company);
//           setOrder((prev) => ({
//             ...prev,
//             orderNo: po?.orderNo,
//             vendorId: po?.vendorId,
//             poDate: po?.poDate,
//             finYear: po?.finYear,
//             address: po?.address,
//             country: po?.country,
//             state: po?.state,
//             city: po?.city,
//             pin: po?.pin,
//             grandTotal: po?.grandTotal,
//             items: po?.items,
//           }));
//         } else {
//           toast.error("Failed to fetch data.");
//         }
//       } catch (error) {
//         if (error.response && error.response.data.error) {
//           toast.error(error.response.data.error);
//         } else {
//           toast.error("An error occurred while fetching data.");
//         }
//       }
//     };

//     fetchItem();
//     fetchData();
//   }, [id]);

//   const downloadPDF = () => {
//     if (!order) return;

//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text("Purchase Order", 14, 20);

//     doc.setFontSize(12);
//     doc.text(`Order No: ${order.orderNo}`, 14, 30);
//     doc.text(`PO Date: ${new Date(order.poDate).toLocaleDateString()}`, 14, 38);
//     doc.text(`Financial Year: ${order.finYear}`, 14, 46);
//     doc.text(`Vendor: ${order.vendorId.vendorName}`, 14, 54);
//     doc.text(`Address: ${order.address}`, 14, 62);
//     doc.text(
//       `Location: ${order.city.name}, ${order.state.name}, ${order.country.name}`,
//       14,
//       70
//     );
//     doc.text(`PIN: ${order.pin}`, 14, 78);

//     // Table for items
//     const tableData = order.items.map((item, i) => [
//       i + 1,
//       item.itemName,
//       item.itemQty,
//       item.itemRate,
//       item.itemAmt,
//     ]);

//     autoTable(doc, {
//       startY: 90,
//       head: [["#", "Item Name", "Qty", "Rate", "Amount"]],
//       body: tableData,
//     });

//     // Grand Total
//     let finalY = doc.lastAutoTable?.finalY || 90;
//     doc.text(`Grand Total: ₹${order.grandTotal}`, 14, finalY + 10);

//     doc.save(`PurchaseOrder_${order.orderNo}.pdf`);
//   };

//   const reactToPrintFn = useReactToPrint({ contentRef });
//   if (!order) {
//     return <p className="p-6">Loading order...</p>;
//   }

//   return (
//     <>
//       <div className="p-6 text-white bg-gray-400" ref={contentRef}>
//         <h1 className="text-xl font-bold mb-4">Purchase Order</h1>
//         <div className="flex justify-between items-center gap-2">
//           <div className="bg-red-400">
//             <img src={bg} alt="logo" height={100} width={100} />
//           </div>
//           <div className="">
//             {company.length > 0 ? (
//               company.map((c) => (
//                 <>
//                   <div className="flex justify-evenly items-center gap-2">
//                     <div className="p-4 ">
//                       <h1 className="text-2xl font-bold">{c.companyName}</h1>
//                       <p className="text-right font-semibold text-xl">
//                         {c.address1} {c.address2}
//                       </p>

//                       <p className="text-right font-semibold text-xl"></p>
//                       <p className="text-right font-semibold text-xl">
//                         {c.city?.name} {c.state?.name}
//                       </p>
//                       <p className="text-right font-semibold text-xl">
//                         {c.pin}
//                       </p>
//                       <p className="text-right font-semibold text-xl">
//                         {c.gstNumber}
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               ))
//             ) : (
//               <>
//                 <h1>No Data Found</h1>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="border rounded-lg p-4 shadow-sm">
//           <h2 className="font-semibold text-lg mb-2">
//             Order No: {order.orderNo}
//           </h2>
//           <p>Date: {new Date(order.poDate).toLocaleDateString()}</p>
//           <p>Financial Year: {order.finYear}</p>
//           <p>Vendor: {order.vendorId.vendorName}</p>
//           <p>
//             Delivery Address: {order.address}, {order.city.name},{" "}
//             {order.state.name}, {order.country.name} - {order.pin}
//           </p>

//           <table className="w-full mt-4 border-collapse border text-sm">
//             <thead>
//               <tr className="bg-gray-100 text-black">
//                 <th className="border p-2">#</th>
//                 <th className="border p-2">Item Name</th>
//                 <th className="border p-2">Qty</th>
//                 <th className="border p-2">Rate</th>
//                 <th className="border p-2">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {order.items.map((item, i) => (
//                 <tr key={item.itemId._id}>
//                   <td className="border p-2">{i + 1}</td>
//                   <td className="border p-2">{item.itemName}</td>
//                   <td className="border p-2">{item.itemQty}</td>
//                   <td className="border p-2">₹{item.itemRate}</td>
//                   <td className="border p-2">₹{item.itemAmt}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <p className="mt-2 font-semibold">Grand Total: ₹{order.grandTotal}</p>
//         </div>
//       </div>
//       <div className="flex flex-col sm:flex-row justify-center gap-4 mt-5">
//         <button
//           className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg transition"
//           onClick={reactToPrintFn}
//         >
//           <PrinterCheck /> Print PDF
//         </button>

//         <button
//           onClick={downloadPDF}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
//         >
//           <Download />
//           Download PDF
//         </button>
//         <Link
//           to="/purchase/purchase-order"
//           className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
//         >
//           <ChevronLeftCircle />
//           Back
//         </Link>
//       </div>
//     </>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import api from "../../../api/axios";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeftCircle, Download, PrinterCheck } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import bg from "../../../assets/bg.png"; // company logo

export default function PurchaseOrderView() {
  const [order, setOrder] = useState(null);
  const [company, setCompany] = useState([]);
  const contentRef = useRef();
  const { id } = useParams();

  // Fetch company details
  const fetchData = async () => {
    try {
      const response = await api.get("/admin/getcompanies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setCompany(response.data.companies);
      }
    } catch {
      toast.error("Failed to fetch company details");
    }
  };

  // Fetch order details
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
          setOrder({
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
          });
        } else {
          toast.error("Failed to fetch data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching order.");
      }
    };

    fetchItem();
    fetchData();
  }, [id]);

  // Download PDF
  const downloadPDF = () => {
    if (!order) return;

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // Header background
    doc.setFillColor(37, 99, 235); // blue
    doc.rect(0, 0, pageWidth, 80, "F");

    // Logo (optional)
    try {
      doc.addImage(bg, "PNG", margin, 15, 50, 50);
    } catch (err) {
      console.warn("Logo not added, check bg.png path");
    }

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("PURCHASE ORDER", margin + 70, 50);

    // Company Info (top-right)
    if (company.length > 0) {
      const c = company[0];
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(c.companyName || "", pageWidth - margin, 25, { align: "right" });
      doc.text(
        `${c.address1 || ""} ${c.address2 || ""}`,
        pageWidth - margin,
        40,
        {
          align: "right",
        }
      );
      doc.text(
        `${c.city?.name || ""}, ${c.state?.name || ""}`,
        pageWidth - margin,
        55,
        {
          align: "right",
        }
      );
      doc.text(`GST: ${c.gstNumber || ""}`, pageWidth - margin, 70, {
        align: "right",
      });
    }

    // Order + Vendor Info
    let y = 120;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`Order No: ${order.orderNo}`, margin, y);
    doc.text(
      `PO Date: ${new Date(order.poDate).toLocaleDateString()}`,
      margin,
      y + 20
    );
    doc.text(`Financial Year: ${order.finYear}`, margin, y + 40);

    doc.setFont("helvetica", "bold");
    doc.text("Vendor:", margin, y + 70);
    doc.setFont("helvetica", "normal");
    doc.text(order.vendorId.vendorName || "", margin, y + 90);
    doc.text(
      `${order.address}, ${order.city?.name}, ${order.state?.name}, ${order.country?.name} - ${order.pin}`,
      margin,
      y + 110
    );

    // Items Table
    const tableData = order.items.map((item, i) => [
      i + 1,
      item.itemName,
      item.itemQty,
      `₹${item.itemRate.toFixed(2)}`,
      `₹${item.itemAmt.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: y + 140,
      head: [["#", "Item Name", "Qty", "Rate", "Amount"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        font: "helvetica",
        fontSize: 10,
        valign: "middle",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 40 },
        1: { cellWidth: 200 },
        2: { halign: "center", cellWidth: 60 },
        3: { halign: "right", cellWidth: 80 },
        4: { halign: "right", cellWidth: 80 },
      },
    });

    // Totals
    const subtotal = order.items.reduce((acc, item) => acc + item.itemAmt, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    let finalY = doc.lastAutoTable.finalY + 30;
    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth - 250, finalY, 200, 80, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, pageWidth - 240, finalY + 25);
    doc.text(`Tax (18%): ₹${tax.toFixed(2)}`, pageWidth - 240, finalY + 45);

    doc.setFont("helvetica", "bold");
    doc.text(`Total: ₹${total.toFixed(2)}`, pageWidth - 240, finalY + 70);

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for your business!", pageWidth / 2, finalY + 120, {
      align: "center",
    });
    doc.text("Payment is due within 10 days.", pageWidth / 2, finalY + 135, {
      align: "center",
    });

    // Save
    doc.save(`PurchaseOrder_${order.orderNo}.pdf`);
  };

  // Print
  const reactToPrintFn = useReactToPrint({ contentRef });

  if (!order) {
    return <p className="p-6">Loading order...</p>;
  }

  return (
    <>
      {/* On-screen Preview */}
      <div className="p-6 bg-white shadow-md rounded-lg" ref={contentRef}>
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <img src={bg} alt="logo" className="h-16 w-16 object-contain" />
            <h1 className="text-2xl font-bold text-gray-800">Purchase Order</h1>
          </div>
          <div className="text-right">
            {company.length > 0 ? (
              <>
                <h2 className="text-lg font-bold">{company[0].companyName}</h2>
                <p className="text-sm text-gray-600">
                  {company[0].address1}, {company[0].address2}
                </p>
                <p className="text-sm text-gray-600">
                  {company[0].city?.name}, {company[0].state?.name} -{" "}
                  {company[0].pin}
                </p>
                <p className="text-sm text-gray-600">
                  GST: {company[0].gstNumber}
                </p>
              </>
            ) : (
              <p>No Company Data</p>
            )}
          </div>
        </div>

        {/* Order Info */}
        <div className="mb-6">
          <p>
            <span className="font-semibold">Order No:</span> {order.orderNo}
          </p>
          <p>
            <span className="font-semibold">PO Date:</span>{" "}
            {new Date(order.poDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Financial Year:</span>{" "}
            {order.finYear}
          </p>
          <p>
            <span className="font-semibold">Vendor:</span>{" "}
            {order.vendorId.vendorName}
          </p>
          <p>
            <span className="font-semibold">Delivery Address:</span>{" "}
            {order.address}, {order.city.name}, {order.state.name},{" "}
            {order.country.name} - {order.pin}
          </p>
        </div>

        {/* Items Table */}
        <table className="w-full border text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
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
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{item.itemName}</td>
                <td className="border p-2 text-center">{item.itemQty}</td>
                <td className="border p-2 text-right">₹{item.itemRate}</td>
                <td className="border p-2 text-right">₹{item.itemAmt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-6">
          <div className="w-1/3 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{order.grandTotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax (18%):</span>
              <span className="font-medium">
                ₹{(order.grandTotal * 0.18).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{(order.grandTotal * 1.18).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
          <Download /> Download PDF
        </button>

        <Link
          to="/purchase/purchase-order"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
        >
          <ChevronLeftCircle /> Back
        </Link>
      </div>
    </>
  );
}
