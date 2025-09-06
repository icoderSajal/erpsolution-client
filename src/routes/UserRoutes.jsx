import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

import UserDashboard from "../pages/user/UserDashboard";
import UserSummary from "../pages/user/UserSummary";
import UserAttendance from "../pages/user/UserAttendance";

const UserRoutes = () => (
  <>
    <Route
      path="/user"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={[0, 1, 2]}>
            <UserDashboard />
          </RoleRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<UserSummary />} />
      <Route path="attendance" element={<UserAttendance />} />
      <Route
        path="allowance"
        element={<h1 className="text-white">Attendance</h1>}
      />
      <Route
        path="salary-slip"
        element={<h1 className="text-white">Salary Slip</h1>}
      />
      <Route
        path="apply-leaves"
        element={<h1 className="text-white">Apply leaves</h1>}
      />
    </Route>
  </>
);

export default UserRoutes;
