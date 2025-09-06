import { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function LeadCreation() {
  const [errors, setErrors] = useState({});

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leadId: "",
    leadDate: "",
    fname: "",
    lname: "",
    whatAppNo: "",

    mobileNumber: "",
    email: "",
    callBackDate: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    comments: "",
    interest: "",
    priority: "",

    active: 1,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  // Fetch countries
  useEffect(() => {
    axios
      .get("http://localhost:9000/api/local/countries")
      .then((res) => setCountries(res.data.countries))
      .catch(() => console.log("Error fetching countries"));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formData.country) {
      axios
        .get(`http://localhost:9000/api/local/states/${formData.country}`)
        .then((res) => setStates(res.data.states))
        .catch(() => console.log("Error fetching states"));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.state) {
      axios
        .get(`http://localhost:9000/api/local/cities/${formData.state}`)
        .then((res) => setCities(res.data.cities))
        .catch(() => console.log("Error fetching cities"));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Validation
  const validate = () => {
    let newErrors = {};
    if (!formData.leadId) newErrors.leadId = "Lead Id  is required";
    if (!formData.leadDate) newErrors.leadDate = "Lead Date Id  is required";
    if (!formData.fname) newErrors.fname = "First name is required";
    if (!formData.lname) newErrors.lname = "Last Name is required";
    if (!formData.whatAppNo) newErrors.whatAppNo = "WhatApp number is required";
    else if (!/^\d+$/.test(formData.whatAppNo))
      newErrors.whatAppNo = "Only numbers allowed";

    if (!formData.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^\d+$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Only numbers allowed";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.callBackDate) newErrors.callBackDate = "Date is required";
    if (!formData.country) newErrors.country = "Please select a country";
    if (!formData.state) newErrors.state = "Please select a state";
    if (!formData.city) newErrors.city = "Please select a city";
    if (!formData.pin) newErrors.pin = "PIN is required";
    if (!formData.comments) newErrors.comments = "Comments  is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    if (!formData.interest) newErrors.interest = "Interest is required";
    if (!formData.companyEmail)
      newErrors.companyEmail = "Company email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <div className="mt-5 bg-gray-50 p-6 rounded-2xl shadow-black">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>Leads Tracker</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
            {/* Lead Id */}
            <div>
              <label htmlFor="leadId" className="block text-sm font-bold mb-1">
                Lead ID
              </label>
              <input
                type="text"
                name="leadId"
                value={formData.leadId}
                onChange={handleChange}
                placeholder="e.g., Abhiyaan Technologies"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.leadId && (
                <p className="text-red-500 text-xs">{errors.leadId}</p>
              )}
            </div>
            {/* Lead Date */}
            <div>
              <label
                htmlFor="leadDate"
                className="block text-sm font-bold mb-1"
              >
                Lead Date
              </label>
              <input
                type="date"
                name="leadDate"
                value={formData.leadDate}
                onChange={handleChange}
                placeholder="e.g., Abhiyaan Technologies"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.leadDate && (
                <p className="text-red-500 text-xs">{errors.leadDate}</p>
              )}
            </div>
            {/* First Name */}
            <div>
              <label htmlFor="fname" className="block text-sm font-bold mb-1">
                First Name
              </label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                placeholder="e.g., Abhi"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.fname && (
                <p className="text-red-500 text-xs">{errors.fname}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lname" className="block text-sm font-bold mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                placeholder="e.g., Bajaj"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.lname && (
                <p className="text-red-500 text-xs">{errors.lname}</p>
              )}
            </div>
            {/* whatAppNo */}
            <div>
              <label
                htmlFor="whatAppNo"
                className="block text-sm font-bold mb-1"
              >
                WhatAppNo
              </label>
              <input
                type="number"
                name="whatAppNo"
                value={formData.whatAppNo}
                onChange={handleChange}
                placeholder="e.g., xxxxxx8629"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.whatAppNo && (
                <p className="text-red-500 text-xs">{errors.whatAppNo}</p>
              )}
            </div>
            {/* Mobile No */}
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-bold mb-1"
              >
                Mobile No
              </label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="e.g., xxxxxx8629"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs">{errors.mobileNumber}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 mx-[50px] mb-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1">
                Email ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., example@gmail.com "
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            {/* callBackDate */}
            <div>
              <label
                htmlFor="callBackDate"
                className="block text-sm font-bold mb-1"
              >
                CallBack Date & Time
              </label>
              <input
                type="datetime-local"
                id="callBackDate"
                name="callBackDate"
                value={formData.callBackDate}
                onChange={handleChange}
                placeholder="Enter Your Address"
                rows={2}
                className="w-full border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.callBackDate && (
                <p className="text-red-500 text-xs">{errors.callBackDate}</p>
              )}
            </div>

            {/* Priority */}

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-bold mb-1"
              >
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300  rounded"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium </option>
                <option value="high">High </option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-xs">{errors.priority}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="interest"
                className="block text-sm font-bold mb-1"
              >
                Interest
              </label>
              <select
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300  rounded"
              >
                <option value="">Select Interest</option>
                <option value="solar">Solar Pannel</option>
                <option value="batteries">Batteries </option>
                <option value="invator">Invator </option>
              </select>
              {errors.interest && (
                <p className="text-red-500 text-xs">{errors.interest}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 mx-[50px] mb-5">
            <div className="col-span-2 row-span-4">
              {/* Address 2 */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-bold mb-1"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Your Address"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>
            </div>
            <div className="row-span-">
              <div className="sm:block md:block">
                <label className="block text-sm font-bold mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-xs">{errors.country}</p>
                )}
              </div>

              {/* city */}
              <div>
                <label className="block text-sm font-bold mb-1">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300  rounded"
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-xs">{errors.city}</p>
                )}
              </div>
            </div>
            <div className="row-span-2 ">
              <div className="col-span-2">
                <div className="col-span-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs">{errors.state}</p>
                    )}
                  </div>
                </div>
                <div className="col-1"></div>
              </div>

              <div className="col-span-2">
                {/* PIN */}
                <div className="md:col-span-1">
                  <label htmlFor="pin" className="block text-sm font-bold mb-1">
                    PIN
                  </label>
                  <input
                    id="pin"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    placeholder="243001"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  {errors.pin && (
                    <p className="text-red-500 text-xs">{errors.pin}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
            <div className="col-span-2">
              <label
                htmlFor="comments"
                className="block text-sm font-bold mb-1"
              >
                Comments
              </label>
              <textarea
                type="text"
                name="comments"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="e.g., Comments"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              ></textarea>
              {errors.comments && (
                <p className="text-red-500 text-xs">{errors.comments}</p>
              )}
            </div>

            <div>
              <label htmlFor="active" className="block text-sm font-bold mb-1">
                Status
              </label>
              <select
                name="active"
                value={formData.active}
                onChange={handleChange}
                className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md "
              >
                <option value="1">Cold Deal</option>
                <option value="1">Hold Deal</option>
                <option value="0">Work in Progress</option>
                <option value="0">Closed Deal</option>
              </select>
              {errors.active && (
                <p className="text-red-500 text-xs">{errors.active}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end items-end gap-2 mx-[50px]">
            <button className="px-4 py-2 rounded text-white bg-black">
              Save
            </button>
            <button
              className="px-4 py-2 rounded text-white bg-black"
              onClick={() => navigate("/admin/company-master-list")}
            >
              Back{" "}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
