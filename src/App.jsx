// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import RoleRoute from "./components/RoleRoute";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import Roles from "./pages/admin/roles/Roles";
// import AdminSummary from "./pages/admin/AdminSummary";
// import Permissions from "./pages/admin/permission/Permissions";
// import RouterPermission from "./pages/admin/routerpermissions/RouterPermission";
// import UserDashboard from "./pages/user/UserDashboard";
// import UserSummary from "./pages/user/UserSummary";
// import UserAttendance from "./pages/user/UserAttendance";
// import HrDashboard from "./pages/hr/HrDashboard";
// import HrSummary from "./pages/hr/HrSummary";
// import MarkAttendance from "./pages/hr/MarkAttendance";
// import NotFound from "./pages/NotFound";
// import AccessDenied from "./pages/AccessDenied";
// import CompanyMaster from "./pages/admin/company/CompanyMaster";
// import ClientMaster from "./pages/admin/clients/ClientMaster";
// import ChannelPartner from "./pages/admin/partner/ChannelPartner";
// import VendorMaster from "./pages/admin/vendor/VendorMaster";
// import GstMaster from "./pages/admin/gst/GstMaster";

// import TdsMaster from "./pages/admin/tds/TdsMaster";
// import CustomerMaster from "./pages/admin/customer/CustomerMaster";
// import PasswordResetMaster from "./pages/admin/password-reset/PasswordResetMaster";
// import SystemSetting from "./pages/admin/systemsetting/SystemSetting";
// import UserAccessManagement from "./pages/admin/useraccesscontrole/UserAccessManagement";
// import DepartmentMaster from "./pages/hr/department/DepartmentMaster";
// import CompnayMasterList from "./pages/admin/company/CompnayMasterList";
// import EmployeeMasterList from "./pages/hr/employees/EmployeeMasterList";
// import EmployeeMasterOnBoarding from "./pages/hr/employees/EmployeeMasterOnBoarding";
// import { Toaster } from "react-hot-toast";
// import Test from "./pages/hr/employees/Test";
// import EditCmpanyMaster from "./pages/admin/company/EditCmpanyMaster";
// import LeadCreation from "./pages/leads/LeadCreation";
// import LeadList from "./pages/leads/LeadList";
// import Leaddashboard from "./pages/leads/Leaddashboard";
// import LeadSumarry from "./pages/leads/LeadSumarry";
// import InventoryDashboard from "./pages/inventory/InventoryDashboard";
// import InventorySummary from "./pages/inventory/InventorySummary";
// import UnitMaster from "./pages/inventory/units/UnitMaster";
// import CategoryMaster from "./pages/inventory/category/CategoryMaster";
// import SubCategoryMaster from "./pages/inventory/subCategory/SubCategoryMaster";
// import ItemMasterList from "./pages/inventory/itemMaster/ItemMasterList";
// import ItemMasterCreation from "./pages/inventory/itemMaster/ItemMasterCreation";
// import EditItemMaster from "./pages/inventory/itemMaster/EditItemMaster";
// import SalesDashboard from "./pages/sales/SalesDashboard";
// import SalesSummary from "./pages/sales/SalesSummary";
// import SalesList from "./pages/sales/requisition/SalesList";
// import SalesCreation from "./pages/sales/requisition/SalesCreation";
// import EditSales from "./pages/sales/requisition/EditSales";
// import Sidebar from "./components/Sidebar";
// import AppModules from "./pages/admin/appmodules/AppModules";

// function App() {
//   return (
//     <>
//       <AuthProvider>
//         <BrowserRouter>
//           <Toaster position="top-right" reverseOrder={false} />
//           <Navbar />

//           <Routes>
//             <Route path="/side" element={<Sidebar />}></Route>
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />

//             {/* Error Pages */}
//             <Route path="/access-denied" element={<AccessDenied />} />
//             <Route path="*" element={<NotFound />} />
//             {/* Example protected route */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Home />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Example role-based route: only admin (role=1) can access */}
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute>
//                   <RoleRoute allowedRoles={[1]}>
//                     <AdminDashboard />
//                   </RoleRoute>
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<AdminSummary />}></Route>
//               <Route path="/admin/roles" element={<Roles />} />
//               <Route path="/admin/permissions" element={<Permissions />} />
//               <Route
//                 path="/admin/route-permissions"
//                 element={<RouterPermission />}
//               />
//               <Route path="/admin/company-master" element={<CompanyMaster />} />
//               <Route
//                 path="/admin/company-master-list"
//                 element={<CompnayMasterList />}
//               />

//               <Route
//                 path="/admin/company-master/:id"
//                 element={<EditCmpanyMaster />}
//               />
//               <Route
//                 path="/admin/company-master/:id"
//                 element={<CompanyMaster />}
//               />
//               <Route path="/admin/client-master" element={<ClientMaster />} />
//               <Route
//                 path="/admin/partner-master"
//                 element={<ChannelPartner />}
//               />
//               <Route path="/admin/vendor-master" element={<VendorMaster />} />
//               <Route path="/admin/gst" element={<GstMaster />} />
//               <Route path="/admin/tds" element={<TdsMaster />} />
//               <Route
//                 path="/admin/customer-master"
//                 element={<CustomerMaster />}
//               />
//               <Route
//                 path="/admin/password-reset"
//                 element={<PasswordResetMaster />}
//               />
//               <Route path="/admin/system-setting" element={<SystemSetting />} />
//               <Route
//                 path="/admin/user-access"
//                 element={<UserAccessManagement />}
//               />
//               <Route path="/admin/app-modules" element={<AppModules />}></Route>
//             </Route>

//             {/* Example role-based route: user (role=0) can access */}
//             <Route
//               path="/user"
//               element={
//                 <ProtectedRoute>
//                   <RoleRoute allowedRoles={[0, 1, 2]}>
//                     <UserDashboard />
//                   </RoleRoute>
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<UserSummary />}></Route>
//               <Route path="/user/attendance" element={<UserAttendance />} />
//             </Route>

//             {/* Example role-based route: HR (role=2) can access */}
//             <Route
//               path="/hr"
//               element={
//                 <ProtectedRoute>
//                   <RoleRoute allowedRoles={[1, 2]}>
//                     <HrDashboard />
//                   </RoleRoute>
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<HrSummary />}></Route>
//               <Route path="/hr/mark-attendance" element={<MarkAttendance />} />
//               <Route path="/hr/departments" element={<DepartmentMaster />} />
//               <Route
//                 path="/hr/employee-list"
//                 element={<EmployeeMasterList />}
//               />
//               <Route
//                 path="/hr/employee"
//                 element={<EmployeeMasterOnBoarding />}
//               />
//               <Route
//                 path="/hr/employee/:id"
//                 element={<EmployeeMasterOnBoarding />}
//               />
//             </Route>

//             {/* Example role-based route: user (role=0) can access */}
//             <Route
//               path="/leads"
//               element={
//                 <ProtectedRoute>
//                   <RoleRoute allowedRoles={[0, 1]}>
//                     <Leaddashboard />
//                   </RoleRoute>
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<LeadSumarry />}></Route>
//               <Route path="/leads/list" element={<LeadList />} />
//               <Route path="/leads/creation" element={<LeadCreation />} />
//             </Route>
//             {/*Suervisor*/}
//             <Route
//               path="/inventory"
//               element={
//                 <ProtectedRoute>
//                   <RoleRoute allowedRoles={[1, 4]}>
//                     <InventoryDashboard />
//                   </RoleRoute>
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<InventorySummary />}></Route>
//               <Route path="/inventory/units" element={<UnitMaster />} />
//               <Route path="/inventory/category" element={<CategoryMaster />} />
//               <Route
//                 path="/inventory/sub-category"
//                 element={<SubCategoryMaster />}
//               />
//               <Route
//                 path="/inventory/itemmaster-list"
//                 element={<ItemMasterList />}
//               />
//               <Route
//                 path="/inventory/create-itemmaster"
//                 element={<ItemMasterCreation />}
//               />
//               <Route
//                 path="/inventory/Edit-itemmaster/:id"
//                 element={<EditItemMaster />}
//               />
//             </Route>

//             {/* Sales */}

//             <Route
//               path="/sales"
//               element={
//                 <ProtectedRoute>
//                   <RoleRoute allowedRoles={[1, 4]}>
//                     <SalesDashboard />
//                   </RoleRoute>
//                 </ProtectedRoute>
//               }
//             >
//               <Route
//                 path="/sales/quotation"
//                 element={<h1>Sales quotation</h1>}
//               />
//               <Route index element={<SalesSummary />}></Route>
//               <Route path="/sales/list" element={<SalesList />} />
//               <Route path="/sales/creation" element={<SalesCreation />} />
//               <Route path="/sales/edit/:id" element={<EditSales />} />
//               <Route path="/sales/report" element={<h1>Sales Report</h1>} />
//             </Route>
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Route groups
import AdminRoutes from "./routes/AdminRoutes";
import HrRoutes from "./routes/HrRoutes";
import UserRoutes from "./routes/UserRoutes";
import SalesRoutes from "./routes/SalesRoutes";
import InventoryRoutes from "./routes/InventoryRoutes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          <Route path="/side" element={<Sidebar />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Errors */}
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="*" element={<NotFound />} />

          {/* Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Import Route Groups */}
          {AdminRoutes()}
          {HrRoutes()}
          {UserRoutes()}
          {SalesRoutes()}
          {InventoryRoutes()}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
