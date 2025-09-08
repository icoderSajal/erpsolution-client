import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

import PurchaseDashboard from "../pages/purchase/PurchaseDashboard";
import PurchaseSummary from "../pages/purchase/PurchaseSummary";
import QuotationList from "../pages/purchase/quotation/QuotationList";
import PurchaseOrderList from "../pages/purchase/purchaseorder/PurchaseOrderList";
import QuotationCreation from "../pages/purchase/quotation/QuotationCreation";
import EditQuotation from "../pages/purchase/quotation/EditQuotation";
import PurchaseOrderCreation from "../pages/purchase/purchaseorder/PurchaseOrderCreation";
import EditPurchaseOrder from "../pages/purchase/purchaseorder/EditPurchaseOrder";

import PurchaseOrderPDF from "../pages/purchase/purchaseorder/PurchaseOrderPDF";

const PurchaseRoutes = () => (
  <>
    <Route
      path="/purchase"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={[0, 1, 2]}>
            <PurchaseDashboard />
          </RoleRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<PurchaseSummary />} />
      <Route path="sales-quotation" element={<QuotationList />} />
      <Route path="create-quotation" element={<QuotationCreation />} />
      <Route path="edit-quotation/:id" element={<EditQuotation />} />
      <Route path="purchase-order" element={<PurchaseOrderList />} />
      <Route path="create-purchase-order" element={<PurchaseOrderCreation />} />
      <Route path="edit-purchase-order/:id" element={<EditPurchaseOrder />} />
      <Route path="view-purchase-order/:id" element={<PurchaseOrderPDF />} />
    </Route>
  </>
);

export default PurchaseRoutes;
