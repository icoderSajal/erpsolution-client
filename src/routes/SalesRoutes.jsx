import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import SalesDashboard from "../pages/sales/SalesDashboard";
import SalesSummary from "../pages/sales/SalesSummary";
import SalesList from "../pages/sales/requisition/SalesList";
import SalesCreation from "../pages/sales/requisition/SalesCreation";
import EditSales from "../pages/sales/requisition/EditSales";
import SalesInvoice from "../pages/sales/requisition/SalesInvoice";

const SalesRoutes = () => (
  <>
    <Route
      path="/sales"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={[0, 1, 4]}>
            <SalesDashboard />
          </RoleRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<SalesSummary />} />

      <Route path="/sales/quotation" element={<h1>Sales quotation</h1>} />
      <Route path="sales-list" element={<SalesList />} />
      <Route path="creation" element={<SalesCreation />} />
      <Route path="sales/edit/:id" element={<EditSales />} />
      <Route path="sales/report" element={<h1>Sales Report</h1>} />
      <Route path="view-sale-invoice/:id" element={<SalesInvoice />} />
    </Route>
  </>
);

export default SalesRoutes;
