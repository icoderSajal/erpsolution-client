import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function EmployeeMasterOnBoarding() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [companies, setCompanies] = useState([]);

  const navigate = useNavigate();

  // // // Generate next employee ID
  // useEffect(() => {
  //   const fetchLastEmpId = async () => {
  //     try {
  //       const res = await api.get("/hradmin/get-last-employeeid", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });

  //       if (res.data.lastId) {
  //         const num = parseInt(res.data.lastId.replace("Emp-", "")) + 1;
  //         const newId = `Emp-${num.toString().padStart(4, "0")}`;
  //         setEmployeeId(newId);
  //         setFormData((prev) => ({ ...prev, employeeId: newId }));
  //       } else {
  //         setEmployeeId("Emp-0001");
  //         setFormData((prev) => ({ ...prev, employeeId: "Emp-0001" }));
  //       }
  //     } catch {
  //       setEmployeeId("Emp-0001");
  //       setFormData((prev) => ({ ...prev, employeeId: "Emp-0001" }));
  //     }
  //   };
  //   fetchLastEmpId();
  // }, []);

  // Fetch countries
  useEffect(() => {
    api
      .get("/local/countries")
      .then((res) => setCountries(res.data.countries))
      .catch(() => console.log("Error fetching countries"));
  }, []);

  // Fetch states
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

  // Fetch cities
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

  // Roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/hradmin/get-roles", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setRoles(res.data.roles);
        }
      } catch {
        toast.error("Error fetching roles");
      }
    };
    fetchRoles();
  }, []);

  // Departments
  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await api.get("/hradmin/get-alldepartments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.departments) {
          setDepartments(response.data.departments);
        }
      } catch {
        toast.error("Error fetching departments");
      }
    };
    getDepartments();
  }, []);

  // Image validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG and PNG formats allowed");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.fathername) errors.fathername = "Father's name is required";
    if (!formData.dob) errors.dob = "Date of Birth is required";
    if (!formData.doj) errors.doj = "Date of Joining is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.education) errors.education = "Education is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email";
    if (!formData.mobileNumber)
      errors.mobileNumber = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobileNumber))
      errors.mobileNumber = "Must be 10 digits";
    if (!formData.designation) errors.designation = "Designation is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.role) errors.role = "Role is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.country) errors.country = "Country is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.pin) errors.pin = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pin))
      errors.pin = "Pincode must be 6 digits";
    if (!formData.maritalStatus)
      errors.maritalStatus = "Marital status is required";
    if (!formData.salary) errors.salary = "Salary is required";
    // if (!formData.image) errors.image = "Profile image is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await api.post(`/hradmin/create-user`, formDataObj, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      //public/images
      if (response.data.success) {
        toast.success("Employee Added");
        navigate("/hradmin/employee-list");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        toast.error(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/admin/getcompanies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCompanies(res.data.companies);
      }
    } catch (error) {
      toast.error(`Error to fetch company data`);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-gray-600 backdrop-blur p-8 rounded-md shadow-xl text-white">
      <h2 className="text-4xl font-bold text-center text-teal-50 mb-8">
        Employee Onboarding
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium">Employee ID *</label>
            <input
              type="text"
              name="employeeId"
              placeholder="Enter Employe ID "
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formErrors.name && (
              <p className="text-red-400 text-sm">{formErrors.name}</p>
            )}
          </div>
          {/* Father's Name */}
          <div>
            <label className="block text-sm font-medium">Father's Name *</label>
            <input
              type="text"
              name="fathername"
              placeholder="Enter Father's Name"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formErrors.fathername && (
              <p className="text-red-400 text-sm">{formErrors.fathername}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Date of Birth *</label>

            <input
              placeholder="Date"
              type="date"
              name="dob"
              onChange={handleChange}
              className="mt-1 p-2  block w-full border border-gray-300 rounded-md"
            />
            {formErrors.dob && (
              <p className="text-red-400 text-sm">{formErrors.dob}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              Date of Joining *
            </label>

            <input
              placeholder="Date"
              type="date"
              name="doj"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formErrors.doj && (
              <p className="text-red-400 text-sm">{formErrors.doj}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-50">
              Gender *
            </label>

            <select
              className="mt-1 p-2 block w-full border  border-gray-300 rounded-md"
              name="gender"
              onChange={handleChange}
            >
              <option value="" className="bg-gray-400">
                Select Gender
              </option>
              <option value="male" className="bg-gray-400">
                Male
              </option>
              <option className="bg-gray-400" value="female">
                Female
              </option>
              <option className="bg-gray-400" value="other">
                Other
              </option>
            </select>
            {formErrors.gender && (
              <p className="text-red-400 text-sm">{formErrors.gender}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-50">
              Education *
            </label>
            <input
              placeholder="Enter Education"
              type="text"
              name="education"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formErrors.education && (
              <p className="text-red-400 text-sm">{formErrors.education}</p>
            )}
          </div>
          {/* Example for Email */}
          <div>
            <label className="block text-sm font-medium">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formErrors.email && (
              <p className="text-red-400 text-sm">{formErrors.email}</p>
            )}
          </div>
          {/* Example for Mobile */}
          <div>
            <label className="block text-sm font-medium">Mobile Number *</label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter Mobile Number"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formErrors.mobileNumber && (
              <p className="text-red-400 text-sm">{formErrors.mobileNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-50">
              Designation *
            </label>
            <input
              placeholder="Designation"
              type="text"
              name="designation"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formErrors.designation && (
              <p className="text-red-400 text-sm">{formErrors.designation}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-50">
              Department *
            </label>

            <select
              name="department"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              onChange={handleChange}
            >
              <option value="" className="bg-gray-400">
                Select Department
              </option>
              {departments.map((dep) => (
                <option className="bg-gray-400" key={dep._id} value={dep._id}>
                  {dep.deparmentName}
                </option>
              ))}
            </select>
            {formErrors.department && (
              <p className="text-red-400 text-sm">{formErrors.department}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-50">
              Role *
            </label>
            <select
              name="role"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="" className="bg-gray-400">
                Select Role
              </option>
              {roles.map((r) => (
                <option className="bg-gray-400" key={r._id} value={r.roleValue}>
                  {r.roleName}
                </option>
              ))}
            </select>
            {formErrors.role && (
              <p className="text-red-400 text-sm">{formErrors.role}</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-50">
              Marital Status *
            </label>

            <select
              name="maritalStatus"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option className="bg-gray-400" value="">
                Select Status
              </option>
              <option className="bg-gray-400" value="married">
                Married
              </option>
              <option className="bg-gray-400" value="unmarried">
                Unmarried
              </option>
            </select>
            {formErrors.maritalStatus && (
              <p className="text-red-400 text-sm">{formErrors.maritalStatus}</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-50">
              Salary *
            </label>
            <input
              placeholder="Salary"
              type="text"
              name="salary"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formErrors.salary && (
              <p className="text-red-400 text-sm">{formErrors.salary}</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-50">
              Company *
            </label>
            <select
              name="companyId"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option className="bg-gray-400" value="">
                Select Company
              </option>
              {companies.map((c) => (
                <option className="bg-gray-400" key={c._id} value={c._id}>
                  {c.companyName}
                </option>
              ))}
            </select>
            {formErrors.country && (
              <p className="text-red-400 text-sm">{formErrors.country}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          {/* Address 1 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-50">
              Address *
            </label>
            <textarea
              placeholder="Enter Address"
              type="text"
              name="address"
              onChange={handleChange}
              className="mt-1 mb-1 h-full p-2 block w-full border border-gray-300 rounded-md"
            ></textarea>
            {formErrors.address && (
              <p className="text-red-400 text-sm">{formErrors.address}</p>
            )}
          </div>

          <div className="row-span-2">
            {/* Country */}

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-50">
                Country *
              </label>

              <select
                name="country"
                onChange={handleChange}
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
              {formErrors.country && (
                <p className="text-red-400 text-sm">{formErrors.country}</p>
              )}
            </div>

            {/* City */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-50">
                City *
              </label>

              <select
                name="city"
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
              {formErrors.city && (
                <p className="text-red-400 text-sm">{formErrors.city}</p>
              )}
            </div>
          </div>

          <div className="row-span-2">
            {/* State */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-50">
                State *
              </label>

              <select
                name="state"
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
              {formErrors.state && (
                <p className="text-red-400 text-sm">{formErrors.state}</p>
              )}
            </div>

            {/* PIN */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-50">
                Pincode *
              </label>
              <input
                placeholder="Enter Pincode"
                type="text"
                name="pin"
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              {formErrors.pin && (
                <p className="text-red-400 text-sm">{formErrors.pin}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 items-center mt-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-black ring-1 text-white px-6 py-2 font-bold rounded-lg hover:bg-teal-800 transition duration-300 uppercase"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <Link
            className="bg-black ring-1 text-white px-6 py-2 font-bold rounded-lg hover:bg-teal-800 transition duration-300 uppercase"
            to="/hradmin/employee-list"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
