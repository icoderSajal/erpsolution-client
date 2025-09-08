import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import toast from "react-hot-toast";

export default function EditVendor() {
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    vendorName: "",
    contactPerson: "",
    designation: "",
    deskNumber: "",
    mobileNumber: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    gstNumber: "",
    panNumber: "",
    companyEmail: "",
    active: 1,
    creditDays: "",
    customerType: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  //Get Vendor

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get(`/admin/getvendor/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          const vendor = response.data.vendor;

          setFormData((prev) => ({
            ...prev,
            vendorName: vendor?.vendorName,
            contactPerson: vendor?.contactPerson,
            designation: vendor?.designation,
            deskNumber: vendor?.deskNumber,
            mobileNumber: vendor?.mobileNumber,
            email: vendor?.email,
            address: vendor?.address,
            panNumber: vendor?.panNumber,
            country: vendor?.country,
            state: vendor?.state,
            city: vendor?.city,
            pin: vendor?.pin,
            gstNumber: vendor?.gstNumber,
            companyEmail: vendor?.companyEmail,
            active: vendor?.active,
            customerType: vendor?.customerType,
            creditDays: vendor?.creditDays,
          }));
        } else {
          toast.error("Failed to fetch employee data.");
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("An error occurred while fetching data.");
        }
      }
    };

    fetchCompany();
  }, [id]);

  // Fetch countries
  useEffect(() => {
    api
      .get("/local/countries")
      .then((res) => setCountries(res.data.countries))
      .catch(() => console.log("Error fetching countries"));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formData.country) {
      api
        .get(`/local/states/${formData.country}`)
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
      api
        .get(`/local/cities/${formData.state}`)
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
    if (!formData.vendorName) newErrors.vendorName = "Vendor Name is required";
    if (!formData.contactPerson)
      newErrors.contactPerson = "Contact person is required";
    if (!formData.designation)
      newErrors.designation = "Designation is required";
    if (!formData.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^\d+$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Only numbers allowed";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.country) newErrors.country = "Please select a country";
    if (!formData.state) newErrors.state = "Please select a state";
    if (!formData.city) newErrors.city = "Please select a city";
    if (!formData.pin) newErrors.pin = "PIN is required";
    if (!formData.gstNumber) newErrors.gstNumber = "GST number is required";
    if (!formData.panNumber) newErrors.panNumber = "PAN number is required";
    if (!formData.customerType)
      newErrors.customerType = "CustomerType  is required";
    if (!formData.creditDays) newErrors.creditDays = "creditDays  is required";

    if (!formData.companyEmail)
      newErrors.companyEmail = "Company email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save company
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await api.put(`/admin/update-vendor/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        toast.success("Vendor saved successfully");
        navigate("/admin/vendor-list");
      }
    } catch (error) {
      alert(error);
      toast.error("Error saving Vendor");
    }
  };

  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>Update Vendor Master</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
            <div>
              <label
                htmlFor="vendorName"
                className="block text-sm font-bold mb-1"
              >
                Vendor Comapny Name
              </label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                placeholder="e.g., Abhiyaan Technologies"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.vendorName && (
                <p className="text-red-500 text-xs">{errors.vendorName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="contactPerson"
                className="block text-sm font-bold mb-1"
              >
                Contact Person
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="e.g., Abhi Bajaj"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.contactPerson && (
                <p className="text-red-500 text-xs">{errors.contactPerson}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-bold mb-1"
              >
                Degination
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g., CEO"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.designation && (
                <p className="text-red-500 text-xs">{errors.designation}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="deskNumber"
                className="block text-sm font-bold mb-1"
              >
                Desk No
              </label>
              <input
                type="text"
                name="deskNumber"
                value={formData.deskNumber}
                onChange={handleChange}
                placeholder="e.g., Desk Number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.deskNumber && (
                <p className="text-red-500 text-xs">{errors.deskNumber}</p>
              )}
            </div>
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
                placeholder="e.g., Mobile Number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs">{errors.mobileNumber}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1">
                Email ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., Company Email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5  mx-[50px]">
            {/* Address 1 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900">
                Address *
              </label>
              <textarea
                placeholder="Enter Address"
                value={formData.address}
                type="text"
                name="address"
                onChange={handleChange}
                className="mt-1 mb-1 h-full p-2 block w-full border border-gray-300 rounded-md"
              ></textarea>
              {errors.address && (
                <p className="text-red-400 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="row-span-2">
              {/* Country */}

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-950">
                  Country *
                </label>

                <select
                  name="country"
                  onChange={handleChange}
                  value={formData.country}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                >
                  <option className="bg-gray-400" value="">
                    Select Country
                  </option>
                  {countries.map((c) => (
                    <option className="bg-gray-400" key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-400 text-sm">{errors.country}</p>
                )}
              </div>

              {/* City */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-950">
                  City *
                </label>

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                >
                  <option className="bg-gray-400" value="">
                    Select City
                  </option>
                  {cities.map((c) => (
                    <option className="bg-gray-400" key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-400 text-sm">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="row-span-2">
              {/* State */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-950">
                  State *
                </label>

                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                >
                  <option className="bg-gray-400" value="">
                    Select State
                  </option>
                  {states.map((s) => (
                    <option className="bg-gray-400" key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {errors.state && (
                  <p className="text-red-400 text-sm">{errors.state}</p>
                )}
              </div>

              {/* PIN */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-950">
                  Pincode *
                </label>
                <input
                  placeholder="Enter Pincode"
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
                {errors.pin && (
                  <p className="text-red-400 text-sm">{errors.pin}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
            <div>
              <label
                htmlFor="gstNumber"
                className="block text-sm font-bold mb-1"
              >
                GST Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="e.g., GST Number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.gstNumber && (
                <p className="text-red-500 text-xs">{errors.gstNumber}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="panNumber"
                className="block text-sm font-bold mb-1"
              >
                PAN Number
              </label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="e.g., PAN Number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.panNumber && (
                <p className="text-red-500 text-xs">{errors.panNumber}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="companyEmail"
                className="block text-sm font-bold mb-1"
              >
                Company E-mails
              </label>
              <input
                type="text"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="e.g., Company Email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.companyEmail && (
                <p className="text-red-500 text-xs">{errors.companyEmail}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="customerType"
                className="block text-sm font-bold mb-1"
              >
                Customer Type
              </label>
              <select
                value={formData.customerType}
                onChange={handleChange}
                name="customerType"
                className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Select Customer Type</option>
                <option value="company">Company</option>
              </select>
              {errors.customerType && (
                <p className="text-red-500 text-xs">{errors.customerType}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="address1"
                className="block text-sm font-bold mb-1"
              >
                Credit Days
              </label>
              <input
                type="text"
                name="creditDays"
                value={formData.creditDays}
                onChange={handleChange}
                placeholder="e.g., Credit Days"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.creditDays && (
                <p className="text-red-500 text-xs">{errors.creditDays}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end items-end gap-2 mx-[50px]">
            <button className="px-4 py-2 rounded text-white bg-black">
              Update
            </button>
            <Link
              className="px-4 py-2 rounded text-white bg-black"
              to="/admin/vendor-list"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
