import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <h1 className="text-4xl font-bold text-white">Access Denied</h1>
        <p className="text-gray-100 mt-2">
          You don’t have permission to view this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-100 px-4 py-2 mt-5 rounded-xl hover:bg-gray-600 hover:text-white"
        >
          Back to Home
        </button>
      </div>
    </>
  );
};

export default AccessDenied;
