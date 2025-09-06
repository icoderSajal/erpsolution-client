import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function InventoryDashboard() {
  return (
    <>
      <Navbar />
      <div className="flex overflow-hidden bg-black">
        {/* Main Content Area */}
        {/* <div className="bg-red-300 w-2xl">Userinfo- {JSON.stringify(user)}</div> */}

        <div className=" w-full">
          <main className="pt-16 px-4 overflow-y-auto h-full bg-black">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
