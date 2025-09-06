import React from "react";
import Sidebar from "../../../components/Sidebar";

import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <div className="w-full flex rounded-2xl h-[100vh] bg-gray-600">
        <div className="w-[20%]">
          <Sidebar />
        </div>
        <div className="w-[80%] bg-black">Main Cotent</div>
      </div>
    </>
  );
}
