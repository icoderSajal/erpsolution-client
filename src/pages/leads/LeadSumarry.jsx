import React from "react";
import Cards from "../../components/Cards";
import { NavLink } from "react-router-dom";
export default function LeadSumarry() {
  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold mb-5 text-center">
            Leads Menus
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NavLink to="/leads/list">
              <Cards
                icons="👨"
                text="Leads Lists"
                number={1}
                color="bg-gradient-to-tr from-teal-500 to-teal-700"
              />
            </NavLink>
            <NavLink to="/leads/report">
              <Cards
                icons="👨"
                text="Leads Reports"
                number={1}
                color="bg-gradient-to-tr from-teal-500 to-teal-700"
              />
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
