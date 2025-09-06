import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

import HrDashboard from "../pages/hr/HrDashboard";
import HrSummary from "../pages/hr/HrSummary";
import MarkAttendance from "../pages/hr/MarkAttendance";
import DepartmentMaster from "../pages/hr/department/DepartmentMaster";
import EmployeeMasterList from "../pages/hr/employees/EmployeeMasterList";
import EmployeeMasterOnBoarding from "../pages/hr/employees/EmployeeMasterOnBoarding";
import UpdateEmployeeOnBarding from "../pages/hr/employees/UpdateEmployeeOnBarding";
import AnnualHolidays from "../pages/hr/holidayList/AnnualHolidays";

const HrRoutes = () => {
  return (
    <Route
      path="/hradmin"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={[1, 2]}>
            <HrDashboard />
          </RoleRoute>
        </ProtectedRoute>
      }
    >
      {/* //clgfTU */}
      <Route index element={<HrSummary />} />
      <Route path="mark-attendance" element={<MarkAttendance />} />
      <Route path="departments" element={<DepartmentMaster />} />
      <Route path="employee-list" element={<EmployeeMasterList />} />
      <Route path="employeeonboard" element={<EmployeeMasterOnBoarding />} />
      <Route path="employee/:id" element={<UpdateEmployeeOnBarding />} />
      <Route path="holidays" element={<AnnualHolidays />} />
      <Route
        path="payrolls"
        element={<h1 className="text-white">The Payroll is Working </h1>}
      />
      <Route
        path="approve-leaves"
        element={<h1 className="text-white">The approve-leaves is Working </h1>}
      />
    </Route>
  );
};

export default HrRoutes;
