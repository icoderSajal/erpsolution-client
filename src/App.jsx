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
import PurchaseRoutes from "./routes/PurchaseRoutes";

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
          {PurchaseRoutes()}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
