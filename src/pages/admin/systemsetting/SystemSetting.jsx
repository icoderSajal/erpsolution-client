import React from "react";
import { useNavigate } from "react-router-dom";

function SystemSetting() {
  const navigate = useNavigate();
  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>System Setting</h1>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
          <div>
            <label htmlFor="country" className="block text-sm font-bold mb-1">
              User Department
            </label>
            <select
              name="countryId"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select User Department</option>
              {/* {permissions.map((perm) => (
                      <option key={perm._id} value={perm._id}>
                        {perm.permissionName}
                      </option>
                    ))} */}
            </select>
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Financial Year
            </label>
            <input
              type="text"
              name="contactPerson"
              placeholder="e.g., Abhi Bajaj"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Enquery No.
            </label>
            <input
              type="text"
              name="degination"
              placeholder="e.g., CEO"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Quations Ref. No.
            </label>
            <input
              type="text"
              name="deskNumber"
              placeholder="e.g., Desk Number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Quations Ref. Series
            </label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="e.g., Mobile Number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Release Ref. No.
            </label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="e.g., Mobile Number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-[50px] mb-5">
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Release Ref. Series
            </label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="e.g., Mobile Number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-bold mb-1">
              Recurring Task (*)
            </label>
            <select
              name="countryId"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
              {/* {permissions.map((perm) => (
                      <option key={perm._id} value={perm._id}>
                        {perm.permissionName}
                      </option>
                    ))} */}
            </select>
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-bold mb-1">
              Service List (*)
            </label>
            <select
              name="countryId"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="1">Unlock</option>
              <option value="0">Lock</option>
              {/* {permissions.map((perm) => (
                      <option key={perm._id} value={perm._id}>
                        {perm.permissionName}
                      </option>
                    ))} */}
            </select>
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-bold mb-1">
              Active (Yes/No)
            </label>
            <select
              name="countryId"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end items-end gap-2 mx-[50px]">
          <button className="px-4 py-2 rounded text-white bg-black">
            Save{" "}
          </button>
          <button
            className="px-4 py-2 rounded text-white bg-black"
            onClick={() => navigate("/admin")}
          >
            Back{" "}
          </button>
        </div>
      </div>
    </>
  );
}

export default SystemSetting;
