import { ChevronLeftCircle } from "lucide-react";
import Cards from "../../components/Cards";
import { NavLink } from "react-router-dom";
export default function SalesSummary() {
  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <NavLink
          to="/"
          className="float-end mx-[50px] px-2 py-2 text-white bg-gray-950 rounded-2xl mt-4"
        >
          <ChevronLeftCircle />
        </NavLink>
        <div className="bg-gray-800 text-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold mb-5 text-center">
            Sales Menus
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NavLink to="/sales/quotation">
              <Cards
                icons="👨"
                text="Sales Quotation"
                number={1}
                color="bg-black"
              />
            </NavLink>

            <NavLink to="/sales/list">
              <Cards icons="👨" text="Sales List" number={1} color="bg-black" />
            </NavLink>
            <NavLink to="/sales/report">
              <Cards
                icons="👨"
                text="Leads Reports"
                number={1}
                color="bg-black"
              />
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
