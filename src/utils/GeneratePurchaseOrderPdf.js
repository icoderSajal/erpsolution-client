import jsPDF from "jspdf";
import "jspdf-autotable";

export const GeneratePurchaseOrderPdf = (order) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Purchase Order", 14, 20);

    // Order details
    doc.setFontSize(12);
    doc.text(`Order No: ${order.orderNo}`, 14, 30);
    doc.text(`Vendor: ${order.vendorId?.vendorName || ""}`, 14, 38);
    doc.text(`Date: ${new Date(order.poDate).toLocaleDateString()}`, 14, 46);
    doc.text(`Financial Year: ${order.finYear}`, 14, 54);
    doc.text(`Address: ${order.address}`, 14, 62);

    // Items table
    const tableData = order.items.map((item, index) => [
        index + 1,
        item.itemName,
        item.itemQty,
        item.itemRate,
        item.itemAmt,
    ]);

    doc.autoTable({
        startY: 70,
        head: [["#", "Item Name", "Qty", "Rate", "Amount"]],
        body: tableData,
    });

    // Grand total
    doc.text(`Grand Total: ${order.grandTotal}`, 14, doc.lastAutoTable.finalY + 10);

    return doc;
};
