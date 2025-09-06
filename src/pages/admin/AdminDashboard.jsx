import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="w-full flex overflow-hidden bg-gray-100">
        {/* Main Content Area */}

        <main className="w-full  pt-16 px-4 overflow-y-auto bg-black">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
