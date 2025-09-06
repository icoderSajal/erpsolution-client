import { PenBoxIcon, Trash2Icon } from "lucide-react";

export default function SubCategoryTable({
  data,
  onEdit,
  onDelete,
  indexOfFirstItem,
}) {
  return (
    <table className="w-full text-sm text-left text-gray-700">
      <thead className="text-xs uppercase bg-gray-100 text-gray-800">
        <tr>
          <th className="px-6 py-4">#</th>
          <th className="px-6 py-4">Sub Category Code</th>
          <th className="px-6 py-4">Sub Category Name</th>
          <th className="px-6 py-4">Main Category</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((menu, index) => (
          <tr
            key={menu._id}
            className={`${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } hover:bg-gray-100`}
          >
            <td className="px-6 py-4">{indexOfFirstItem + index + 1}</td>
            <td className="px-6 py-4">{menu.subcatgoryCode}</td>
            <td className="px-6 py-4">{menu.subcatgoryName}</td>
            <td className="px-6 py-4">{menu.categoryId?.catgoryName}</td>
            <td className="px-6 py-4">
              {menu.active === 1 ? "Active" : "Inactive"}
            </td>
            <td className="px-6 py-4 text-center space-x-3">
              <button
                onClick={() => onEdit(menu)}
                className="bg-gray-600 hover:bg-black text-white px-1 py-1 rounded"
              >
                <PenBoxIcon />
              </button>
              <button
                onClick={() => onDelete(menu._id)}
                className="bg-gray-600 hover:bg-black text-white px-1 py-1 rounded"
              >
                <Trash2Icon />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
