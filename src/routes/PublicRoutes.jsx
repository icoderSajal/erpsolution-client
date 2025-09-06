import { Route, Routes } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import AccessDenied from "../pages/AccessDenied";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";

const PublicRoutes = () => (
  <>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  </>
);

export default PublicRoutes;
