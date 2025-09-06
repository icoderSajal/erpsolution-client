import React from "react";
import { useNavigate } from "react-router-dom";

function ChannelPartner() {
  const navigate = useNavigate();
  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>Channel Partner Master</h1>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Partner Name
            </label>
            <input
              type="text"
              name="companyName"
              placeholder="e.g., Abhiyaan Technologies"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Contact Person
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
              Degination
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
              Desk No
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
              Mobile No
            </label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="e.g., Mobile Number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="company-email"
              className="block text-sm font-bold mb-1"
            >
              Email ID
            </label>
            <input
              type="email"
              name="company-email"
              placeholder="e.g., Company Email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        {/* <div className="grid grid-flow-col gap-5 grid-row-2 mx-[50px]">
          <div className="grid-cols-1">
            <div>Address</div>
          </div>
          <div className="grid-cols-1">
            <div>Add1</div>
            <div>Add2</div>
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-[50px]">
          {/* Address 1 */}
          <div className="md:col-span-2">
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Address 1
            </label>
            <textarea
              id="address1"
              name="address1"
              placeholder="Enter Your Address"
              rows={2}
              className="w-full border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          {/* Address 2 */}
          <div className="md:col-span-2">
            <label htmlFor="address2" className="block text-sm font-bold mb-1">
              Address 2
            </label>
            <textarea
              id="address2"
              name="address2"
              placeholder="Enter Your Address"
              rows={2}
              className="w-full border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Country */}
          <div className="md:col-span-1">
            <label htmlFor="country" className="block text-sm font-bold mb-1">
              Country
            </label>
            <select
              name="countryId"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select Country</option>
              {/* {permissions.map((perm) => (
                      <option key={perm._id} value={perm._id}>
                        {perm.permissionName}
                      </option>
                    ))} */}
            </select>
          </div>
          {/* State */}
          <div className="md:col-span-1">
            <label htmlFor="state" className="block text-sm font-bold mb-1">
              State
            </label>
            <select
              name="countryId"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select State</option>
              {/* {permissions.map((perm) => (
                      <option key={perm._id} value={perm._id}>
                        {perm.permissionName}
                      </option>
                    ))} */}
            </select>
          </div>
          {/* City */}
          <div className="md:col-span-1">
            <label htmlFor="city" className="block text-sm font-bold mb-1">
              City
            </label>
            <select
              name="countryId"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select City</option>
              {/* {permissions.map((perm) => (
                      <option key={perm._id} value={perm._id}>
                        {perm.permissionName}
                      </option>
                    ))} */}
            </select>
          </div>
          {/* PIN */}
          <div className="md:col-span-1">
            <label htmlFor="pin" className="block text-sm font-bold mb-1">
              PIN
            </label>
            <input
              id="pin"
              name="pin"
              placeholder="243001"
              type="text"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              GST Number
            </label>
            <input
              type="text"
              name="GST Number"
              placeholder="e.g., GST Number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              PAN Number
            </label>
            <input
              type="text"
              name="contactPerson"
              placeholder="e.g., PAN Number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Active
            </label>
            <select
              name="countryId"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select</option>
              <option value="">Yes</option>
              <option value="">No</option>
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

export default ChannelPartner;
