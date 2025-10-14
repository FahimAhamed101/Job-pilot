

/* eslint-disable react/prop-types */
import { Image } from "antd";
import { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import Vector from "../../../assets/icone/Vector.png";
import icon6 from "../../../assets/icone/dashboard.png";
import admin from "../../../assets/icone/admin_panel_settings.png";
import analyst from "../../../assets/icone/visibility.png";
import icone7 from "../../../assets/icone/video_library.png";
import payment from "../../../assets/icone/payment.png";
import work_outline from "../../../assets/icone/work_outline.png";
import icone2 from "../../../assets/icone/user.svg";
import setting from "../../../assets/icone/setting.png"
import people from "../../../assets/icone/people.png"
import { logoutUser } from "../../../redux/features/auth/authSlice";
import logo from "/public/logo/logo.png";

const sidebarItems = [
  {
    path: "/",
    name: "Dashboard",
    icon: <Image src={icon6} className="size-6 text-white" preview={false} />,
  },
  {
    path: "/admin",
    name: "Admin",
    icon: <Image src={admin} className="size-6" preview={false} />,
  },
  {
    path: "/analyst",
    name: "Analyst",
    icon: <Image src={analyst} className="size-6" preview={false} />,
  },
  
  {
    path: "/users",
    name: "Users",
    icon: <Image src={icone2} className="size-6 text-white" preview={false} />,
  },
 
  {
    path: "/applied",
    name: "Applied",
    icon: <Image src={work_outline} className="size-6" preview={false} />,
  },
  {
    path: "/Recruiters",
    name: "Recruiters",
    icon: <Image src={people} className="size-6" preview={false} />,
  },
  {
    path: "/laibary",
    name: "Library",
    icon: <Image src={icone7} className="size-6" preview={false} />,
  },
  {
    path: "/payments",
    name: "Payments",
    icon: <Image src={payment} className="size-6" preview={false} />,
  },
  
  {
    path: "/content",
    name: "Content",
    icon: <Image src={Vector} className="size-6" preview={false} />,
  },
  {
    path: "/setting",
    name: "Setting",
    icon: <Image src={setting} className="size-6" preview={false} />,
  },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth");
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-[220px] lg:w-[260px] xl:w-[280px] bg-[#FFFFFF] fixed h-screen shadow-2xl">
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex flex-col md:mr-7 items-center text-white my-8 border-b">
              <img
                src={logo}
                alt="logo"
                className="w-[254px] h-[66px] mb-4 object-contain"
              />
            </div>

            <ul className="flex flex-col gap-2">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-[80%] mx-auto px-5 py-4 flex items-center gap-3 rounded-[10px] transition-all duration-300 ease-in-out  ${
                      isActive
                        ? "bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white"
                        : "text-black"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`${
                          isActive ? "text-white" : "text-black"
                        } transition-all duration-300 ease-in-out`}
                      >
                        <Image
                          src={item.icon.props.src}
                          className={`size-6 ${isActive ? "filter-white" : ""}`}
                          preview={false}
                        />
                      </span>
                      <span
                        className={`${
                          isActive ? "text-white" : "text-black"
                        } transition-all duration-300 ease-in-out`}
                      >
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </ul>
          </div>
           
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-[#4C7E95] shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col justify-center items-center pt-5 gap-2 text-white">
          <img src={logo} alt="logo" className="h-20 mb-5" />
        </div>
        <ul className="flex flex-col gap-3">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `w-[70%] mx-auto px-5 py-2 flex items-center gap-3 text-white rounded-md transition-all duration-300 ease-in-out hover:bg-[#85594B] ${
                  isActive ? "bg-[#85594B]" : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>
                    <Image
                      src={item.icon.props.src}
                      className={`size-6 ${isActive ? "filter-white" : ""}`}
                      preview={false}
                    />
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </ul>
        <button
          onClick={() => {
            setShowModal(true);
            toggleSidebar();
          }}
          className="flex items-center gap-2 px-10 py-4 text-black ml-6"
        >
          <IoIosLogOut className="size-8 bg-[#85594B] p-1 rounded-md text-white" />
          <span>Logout</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-between">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                class Meredith

                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;