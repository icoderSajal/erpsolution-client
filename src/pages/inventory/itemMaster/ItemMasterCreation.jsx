import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../../../api/axios";

export default function ItemMasterCreation() {
  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    itemCode: "",
    itemName: "",
    unitId: "",
    openingRate: "",
    mainRate: "",
    hsnNo: "",
    minOrder: "",
    batchNo: "",
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [units, setUnits] = useState([]);

  const navigate = useNavigate();
  // Fetch categories

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/inventory/get-allcategories",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch sub categories
  const fetchSubCategories = async () => {
    if (formData.categoryId) {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/inventory/subcategory/${formData.categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setSubCategories(response.data.subcategories);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Fetch units
  const fetchUnits = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/inventory/get-allunits",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setUnits(response.data.units);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();

    fetchUnits();
  }, []);

  useEffect(() => {
    fetchSubCategories();
  }, [formData.categoryId]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validate = () => {
    let newErrors = {};
    if (!formData.categoryId) newErrors.categoryId = "Please select Category";

    if (!formData.subcategoryId)
      newErrors.subcategoryId = "Please select subcategory";

    if (!formData.itemCode) newErrors.itemCode = "ItemCode is required";

    if (!formData.itemName) newErrors.itemName = "Item Name is required";

    if (!formData.unitId) newErrors.unitId = "Please select a Unit";

    if (!formData.openingRate)
      newErrors.openingRate = "Opening Rate is required";

    if (!formData.mainRate) newErrors.mainRate = "MainRate is required";

    if (!formData.hsnNo) newErrors.hsnNo = "HsnNo is required";

    if (!formData.minOrder) newErrors.minOrder = "MinOrder is required";

    if (!formData.batchNo) newErrors.batchNo = "BatchNo is required";
    // if (!formData.active) newErrors.active = "Active is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save company
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(
        "http://localhost:9000/api/inventory/create-item",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        toast.success("Item saved successfully");
        navigate("/inventory/itemmaster-list");
      }
    } catch (error) {
      toast.error("Errtor saving item", error);
    }
  };
  return (
    <>
      <div className="mt-5 bg-gray-200 p-6 rounded-2xl shadow-black">
        <div className="text-3xl p-2 font-semibold text-center">
          <h1>Item Master</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
            <div>
              <label className="block text-sm font-bold mb-1">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.catgoryName} {"-->"}
                    {c.catgoryCode}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-xs">{errors.categoryId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                Sub Category
              </label>
              <select
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select SubCategory</option>
                {subcategories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.subcatgoryName}
                    {"-->"}
                    {c.subcatgoryCode}
                  </option>
                ))}
              </select>
              {errors.subcategoryId && (
                <p className="text-red-500 text-xs">{errors.subcategoryId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Unit</label>
              <select
                name="unitId"
                value={formData.unitId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Unit</option>
                {units.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.unitName}
                  </option>
                ))}
              </select>
              {errors.unitId && (
                <p className="text-red-500 text-xs">{errors.unitId}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="itemCode"
                className="block text-sm font-bold mb-1"
              >
                Item Code {formData.categoryId.catgoryCode}
              </label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                placeholder="e.g., Enter Item Code"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.itemCode && (
                <p className="text-red-500 text-xs">{errors.itemCode}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="itemName"
                className="block text-sm font-bold mb-1"
              >
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g., Enter Item Name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.itemName && (
                <p className="text-red-500 text-xs">{errors.itemName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="openingRate"
                className="block text-sm font-bold mb-1"
              >
                Opening Rate
              </label>
              <input
                type="text"
                name="openingRate"
                value={formData.openingRate}
                onChange={handleChange}
                placeholder="e.g., opening rate"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.openingRate && (
                <p className="text-red-500 text-xs">{errors.openingRate}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="mainRate"
                className="block text-sm font-bold mb-1"
              >
                Main Rate
              </label>
              <input
                type="text"
                name="mainRate"
                value={formData.mainRate}
                onChange={handleChange}
                placeholder="main rate"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.mainRate && (
                <p className="text-red-500 text-xs">{errors.mainRate}</p>
              )}
            </div>
            <div>
              <label htmlFor="hsnNo" className="block text-sm font-bold mb-1">
                HSN number
              </label>
              <input
                type="text"
                name="hsnNo"
                value={formData.hsnNo}
                onChange={handleChange}
                placeholder="e.g., HSN Number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.hsnNo && (
                <p className="text-red-500 text-xs">{errors.hsnNo}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="minOrder"
                className="block text-sm font-bold mb-1"
              >
                Min. Recorder Level
              </label>
              <input
                type="minOrder"
                name="minOrder"
                value={formData.minOrder}
                onChange={handleChange}
                placeholder="Min Order"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.minOrder && (
                <p className="text-red-500 text-xs">{errors.minOrder}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[50px] mb-5">
            <div>
              <label htmlFor="batchNo" className="block text-sm font-bold mb-1">
                Batch No
              </label>
              <input
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleChange}
                placeholder="e.g., Batch Number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              {errors.batchNo && (
                <p className="text-red-500 text-xs">{errors.batchNo}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end items-end gap-2 mx-[50px]">
            <button className="px-4 py-2 rounded text-white bg-black">
              Save
            </button>
            <Link
              className="px-4 py-2 rounded text-white bg-black"
              to="/inventory/itemmaster-list"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

/////////////////////////////////////
