import { ChevronLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="flex justify-center items-center mt-10">
        <div className="">
          <img src="/notFound.svg" alt="notFound" />
          <h1 className="text-white">LOOKS LIKE YOU'RE LOST</h1>
          <p className="text-white">
            We can't seem to find you the page you're looking for
          </p>
          <div className="flex flex-col justify-between items-center mt-10">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-600 text-white px-4 py-2 mt-6 inset-3 rounded-2xl flex gap-2 hover:ring-2 transition-transform duration-200"
            >
              <span>
                <ChevronLeftCircle />
              </span>
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
