import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const EditCmpanyMaster = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    designation: "",
    deskNumber: "",
    mobileNumber: "",
    email: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    gstNumber: "",
    companyEmail: "",
    active: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  //Get CompanyData

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get(`/admin/getcompany/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          const company = response.data.company;
          //alert(company);
          setFormData((prev) => ({
            ...prev,
            companyName: company?.companyName,
            contactPerson: company?.contactPerson,
            designation: company?.designation,
            deskNumber: company?.deskNumber,
            mobileNumber: company?.mobileNumber,
            email: company?.email,
            address1: company?.address1,
            address2: company?.address2,
            country: company?.country,
            state: company?.state,
            city: company?.city,
            pin: company?.pin,
            gstNumber: company?.gstNumber,
            companyEmail: company?.companyEmail,
            active: company?.active,
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
    if (!formData.companyName)
      newErrors.companyName = "Company name is required";
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
    if (!formData.address1) newErrors.address1 = "Address1 is required";
    if (!formData.country) newErrors.country = "Please select a country";
    if (!formData.state) newErrors.state = "Please select a state";
    if (!formData.city) newErrors.city = "Please select a city";
    if (!formData.pin) newErrors.pin = "PIN is required";
    if (!formData.gstNumber) newErrors.gstNumber = "GST number is required";
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
      const res = await api.put(`/admin/edit-company/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        toast.success("Company updated successfully");
        navigate("/admin/company-master-list");
      }
    } catch (error) {
      toast.error(error, "Error saving company");
    }
  };

  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>Company Master</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-bold mb-1"
              >
                Comapny Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Abhiyaan Technologies"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs">{errors.companyName}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-[50px]">
            {/* Address 1 */}
            <div className="md:col-span-2">
              <label
                htmlFor="address1"
                className="block text-sm font-bold mb-1"
              >
                Address 1
              </label>
              <textarea
                id="address1"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                placeholder="Enter Your Address"
                rows={2}
                className="w-full border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.address1 && (
                <p className="text-red-500 text-xs">{errors.address1}</p>
              )}
            </div>
            {/* Address 2 */}
            <div className="md:col-span-2">
              <label
                htmlFor="address2"
                className="block text-sm font-bold mb-1"
              >
                Address 2
              </label>
              <textarea
                id="address2"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                placeholder="Enter Your Address"
                rows={2}
                className="w-full border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.address2 && (
                <p className="text-red-500 text-xs">{errors.address2}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-[50px] mb-5">
            <div>
              <label className="block text-sm font-bold mb-1">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
            <div>
              <label className="block text-sm font-bold mb-1">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
            <div>
              <label className="block text-sm font-bold mb-1">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
              <label htmlFor="active" className="block text-sm font-bold mb-1">
                Active
              </label>
              <select
                name="active"
                value={formData.active}
                onChange={handleChange}
                className="block w-full text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-md "
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              {errors.active && (
                <p className="text-red-500 text-xs">{errors.active}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end items-end gap-2 mx-[50px]">
            <button className="px-4 py-2 rounded text-white bg-black">
              Update
            </button>
            <Link
              className="px-4 py-2 rounded text-white bg-black"
              to="/admin/company-master-list"
            >
              Back{" "}
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCmpanyMaster;
