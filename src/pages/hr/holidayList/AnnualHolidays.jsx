import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { annulHolidays } from "../../../data/hrData";
import toast from "react-hot-toast";
export default function AnnualHolidays() {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();


  return (
    <div className="w-full bg-gray-800 py-10 px-4 md:px-10 rounded-2xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-50 mb-8">
        Annual Holiday's List
      </h1>
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-bl-3xl rounded-tr-3xl sm:w-1/3 text-white px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-500"
        />
        <div className="flex gap-3">
          {/* <button
              onClick={() => openModal()}
              className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-950 hover:ring-1 transition-all"
            >
              + Add
            </button> */}
          <button
            onClick={() => navigate("/hradmin")}
            className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-black transition-all"
          >
            Back
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {annulHolidays?.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100 text-gray-800">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Holiday Name</th>

                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {annulHolidays.map((menu, index) => (
                <tr
                  key={menu.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-all`}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{menu.holidayName}</td>

                  <td className="px-6 py-4">{menu.ondate}</td>
                </tr>
              ))}
            </tbody>
            {/* <tbody>
                {currentMenus.map((menu, index) => (
                  <tr
                    key={menu._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-all`}
                  >
                    <td className="px-6 py-4">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4">{menu.deparmentName}</td>

                    <td className="px-6 py-4">
                      {menu.departmentActive === 1 ? "Active" : "Inactive"}
                    </td>

                    
                  </tr>
                ))}
              </tbody> */}
          </table>
        ) : (
          <div className="text-center text-gray-600 mt-6">
            No Modules available.
          </div>
        )}
      </div>

      {/* pagination */}
      {/* {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-300 text-gray-800 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? "bg-gray-700 text-white "
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-300 text-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )} */}
    </div>
  );
}
