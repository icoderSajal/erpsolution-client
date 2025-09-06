import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function EmployeeMasterOnBoarding() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Generate next employee ID
  useEffect(() => {
    const fetchLastEmpId = async () => {
      try {
        const res = await api.get("/hradmin/get-last-employeeid", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.lastId) {
          const num = parseInt(res.data.lastId.replace("Emp-", "")) + 1;
          setEmployeeId(`Emp-${num.toString().padStart(4, "0")}`);
          setFormData((prev) => ({
            ...prev,
            employeeId: `Emp-${num.toString().padStart(4, "0")}`,
          }));
        } else {
          setEmployeeId("Emp-0001");
          setFormData((prev) => ({ ...prev, employeeId: "Emp-0001" }));
        }
      } catch (error) {
        setEmployeeId("Emp-0001");
        setFormData((prev) => ({ ...prev, employeeId: "Emp-0001" }));
      }
    };
    fetchLastEmpId();
  }, []);

  // Validation logic
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
      errors.mobileNumber = "Mobile number must be 10 digits";
    if (!formData.designation) errors.designation = "Designation is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.roles) errors.roles = "Role is required";
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
    if (!formData.image) errors.image = "Profile image is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/hradmin/get-roles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setRoles(res.data.roles);
        }
      } catch (error) {
        toast.error("Error to fetch roles");
      }
    };
    fetchRoles();
  }, []);

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
  useEffect(() => {
    const getDepartments = async () => {
      const response = await api.get("/hradmin/get-alldepartments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.departments) {
        setDepartments(response.data.departments);
      }
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const formDataObj = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    alert(JSON.stringify(formData));
    try {
      const response = await api.post(`/hradmin/create-user`, formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success("Employee Added");
        navigate("/hradmin/employee-list");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        toast.error(error.response.data.error);
      }
    }
  };
  return (
    <div className="max-w-6xl mx-auto  bg-gray-600 backdrop-blur p-8 rounded-md shadow-xl text-white">
      <h2 className="text-4xl font-bold text-center text-teal-50 mb-8">
        Employee Onboarding
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Employee ID (readonly) */}
          <div>
            <label className="block text-sm font-medium">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="employeeId"
              value={employeeId}
              readOnly
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-200 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-50">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Enter Name"
              type="text"
              name="name"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
            {formErrors.name && (
              <p className="text-red-400 text-sm">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-50">
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Enter Name"
              type="text"
              name="fathername"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-50">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Enter Email"
              type="email"
              name="email"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-50">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Enter Mobile Number"
              type="text"
              name="mobileNumber"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-50">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              placeholder="Upload Image"
              accept="image/*"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4 items-center mt-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-black ring-1 text-white px-6 py-2 font-bold rounded-lg hover:bg-teal-800 transition duration-300 uppercase"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "Save"
            )}
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
