import { useState, useEffect } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ClientMaster = () => {
  const [customers, setCustomers] = useState([]);

  const fetchCustomer = async () => {
    try {
      const res = await api.get("/admin/getcustomers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (error) {
      toast.error(`Error to fetch Data ${error}`);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);
  const navigate = useNavigate();
  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>Client Master</h1>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Comapny Name
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
              Referance E-mails
            </label>
            <input
              type="text"
              name="contactPerson"
              placeholder="e.g., Company Email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              PAN Number
            </label>
            <input
              type="text"
              name="PAN Number"
              placeholder="e.g., GST Number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-[50px] mb-5">
          <div>
            <label
              htmlFor="customerType"
              className="block text-sm font-bold mb-1"
            >
              Customer Type
            </label>
            <select
              name="customerType"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select Customer Type</option>
              {customers.map((cust) => (
                <option key={cust._id} value={cust._id}>
                  {cust.customerName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="customerType"
              className="block text-sm font-bold mb-1"
            >
              Referance Partner Name
            </label>
            <select
              name="customerType"
              className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select Partner Name</option>
            </select>
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-bold mb-1">
              Credit Days
            </label>
            <input
              type="text"
              name="creditDays"
              placeholder="e.g., Credit Days"
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
};

export default ClientMaster;
