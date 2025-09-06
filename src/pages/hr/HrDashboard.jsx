import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function HrDashboard() {
  return (
    <>
      <Navbar />
      <div className="flex  overflow-hidden bg-gray-100">
        {/* Main Content Area */}
        <div className="w-full">
          <main className="pt-16 px-4 overflow-y-auto h-full bg-black">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
