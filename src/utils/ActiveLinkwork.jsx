/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

const ActiveLinkwork = ({ href, label }) => {
  const location = useLocation();

  // Ensure paths are normalized for comparison
  const normalizePath = (path) => path.replace(/\/$/, "").toLowerCase();
  const currentPath = normalizePath(location.pathname);
  const linkPath = normalizePath(href);

  // Strict match for active class
  const isActive = currentPath === linkPath;

  return (
    <Link
      to={href}
      className={`text-[17px] py-1 ${isActive ? "text-[#85594B] border-b-[2px] border-[#85594B] font-semibold" : "font-semibold text-gray-950"}`}
    >
      {label}
    </Link>
  );
};

export default ActiveLinkwork;



