




import { RiArrowDropDownLine } from "react-icons/ri";
import Status from "../../component/Main/Dashboard/Status";
import CardHome from "./CardHome";

const DashboardHome = () => {
  return (
    <section>
      <div className="p-6 flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-bold text-gray-900">Dashboard</h2>
           
          <p className="text-gray-600 text-xl">Overview of your JobPilot performance</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative flex items-center">
            <select className="appearance-none bg-white p-2 pr-8 rounded shadow text-gray-700 focus:outline-none">
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
              <option>Custom</option>
            </select>
            <RiArrowDropDownLine className="absolute right-2 text-black pointer-events-none" size={24} />
          </div>
        </div>
      </div>
      <div className="px-3">
        <Status />
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 pt-3"></div>
        <CardHome />
      </div>
    </section>
  );
};

export default DashboardHome;