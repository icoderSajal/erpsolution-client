import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import InventoryDashboard from "../pages/inventory/InventoryDashboard";
import InventorySummary from "../pages/inventory/InventorySummary";
import UnitMaster from "../pages/inventory/units/UnitMaster";
import CategoryMaster from "../pages/inventory/category/CategoryMaster";
import SubCategoryMaster from "../pages/inventory/subCategory/SubCategoryMaster";
import ItemMasterList from "../pages/inventory/itemMaster/ItemMasterList";
import ItemMasterCreation from "../pages/inventory/itemMaster/ItemMasterCreation";
import EditItemMaster from "../pages/inventory/itemMaster/EditItemMaster";

const InventoryRoutes = () => (
  <>
    <Route
      path="/inventory"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={[0, 1, 4]}>
            <InventoryDashboard />
          </RoleRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<InventorySummary />} />
      <Route path="units" element={<UnitMaster />} />
      <Route path="categories" element={<CategoryMaster />} />
      <Route path="sub-categories" element={<SubCategoryMaster />} />
      <Route path="itemmaster-list" element={<ItemMasterList />} />
      <Route path="create-item" element={<ItemMasterCreation />} />
      <Route path="edit-itemmaster/:id" element={<EditItemMaster />} />
      <Route path="stocks" element={<EditItemMaster />} />
    </Route>
  </>
);

export default InventoryRoutes;
