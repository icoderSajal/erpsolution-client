import { motion } from "framer-motion";

export default function SubCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  menu,
  categories,
  handleChange,
  handleToggle,
  editId,
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[0000] bg-opacity-40 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold text-center mb-4">
          {editId ? "Edit Category" : "Add Category"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Main Category */}
          <div>
            <label className="block text-sm font-medium">Main Category</label>
            <select
              name="categoryId"
              value={menu.categoryId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.catgoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category Code */}
          <div>
            <label className="block text-sm font-medium">
              Sub Category Code
            </label>
            <input
              type="text"
              name="subcatgoryCode"
              maxLength={3}
              value={menu.subcatgoryCode}
              onChange={handleChange}
              className="w-full border uppercase rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Sub Category Name */}
          <div>
            <label className="block text-sm font-medium">
              Sub Category Name
            </label>
            <input
              type="text"
              name="subcatgoryName"
              value={menu.subcatgoryName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Toggle */}
          <div>
            <label className="block text-sm font-medium mb-1">Permission</label>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={menu.active === 1}
                  onChange={handleToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-black relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
              <span className="ml-3">{menu.active === 1 ? "Yes" : "No"}</span>
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded w-full"
            >
              {editId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
