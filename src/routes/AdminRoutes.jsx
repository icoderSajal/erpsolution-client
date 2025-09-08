import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSummary from "../pages/admin/AdminSummary";
import Roles from "../pages/admin/roles/Roles";
import Permissions from "../pages/admin/permission/Permissions";
import RouterPermission from "../pages/admin/routerpermissions/RouterPermission";
import CompanyMaster from "../pages/admin/company/CompanyMaster";
import CompnayMasterList from "../pages/admin/company/CompnayMasterList";
import EditCmpanyMaster from "../pages/admin/company/EditCmpanyMaster";
import ClientMaster from "../pages/admin/clients/ClientMaster";
import ChannelPartner from "../pages/admin/partner/ChannelPartner";
import VendorMasterList from "../pages/admin/vendor/VendorMasterList";
import GstMaster from "../pages/admin/gst/GstMaster";
import TdsMaster from "../pages/admin/tds/TdsMaster";
import CustomerMaster from "../pages/admin/customer/CustomerMaster";
import PasswordResetMaster from "../pages/admin/password-reset/PasswordResetMaster";
import SystemSetting from "../pages/admin/systemsetting/SystemSetting";
import UserAccessManagement from "../pages/admin/useraccesscontrole/UserAccessManagement";
import AppModules from "../pages/admin/appmodules/AppModules";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import VendorCreation from "../pages/admin/vendor/VendorCreation";
import EditVendor from "../pages/admin/vendor/EditVendor";

const AdminRoutes = () => {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={[1]}>
            <AdminDashboard />
          </RoleRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminSummary />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="app-modules" element={<AppModules />} />
      <Route path="company-master-list" element={<CompnayMasterList />} />
      <Route path="roles" element={<Roles />} />
      <Route path="permissions" element={<Permissions />} />
      <Route path="route-permissions" element={<RouterPermission />} />
      <Route path="company-master" element={<CompanyMaster />} />
      <Route path="company-master/:id" element={<EditCmpanyMaster />} />
      <Route path="client-master" element={<ClientMaster />} />
      <Route path="partner-master" element={<ChannelPartner />} />
      <Route path="vendor-list" element={<VendorMasterList />} />
      <Route path="create-vendor" element={<VendorCreation />} />
      <Route path="edit-vendor/:id" element={<EditVendor />} />

      <Route path="gst" element={<GstMaster />} />
      <Route path="tds" element={<TdsMaster />} />
      <Route path="customer-master" element={<CustomerMaster />} />
      <Route path="password-reset" element={<PasswordResetMaster />} />
      <Route path="system-setting" element={<SystemSetting />} />
      <Route path="user-access" element={<UserAccessManagement />} />
    </Route>
  );
};

export default AdminRoutes;
