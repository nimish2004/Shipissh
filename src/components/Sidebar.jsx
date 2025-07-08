import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm tracking-wide ${
        pathname === to
          ? "bg-cyan-500 text-white shadow"
          : "text-slate-200 hover:bg-slate-600 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="w-60 min-h-screen bg-[#1E293B] text-white flex flex-col justify-between shadow-md border-r border-slate-700">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/vite.svg" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-wide text-cyan-400">
            Shipissh
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navLink("/dashboard", "Dashboard")}
          {navLink("/create-shipment", "New Shipment")}
          {navLink("/track", "Track Shipment")}
          {navLink("/profile", "Profile")}
        </nav>
      </div>

      {/* Footer (optional) */}
      <div className="p-4 text-xs text-slate-400 text-center">
        © {new Date().getFullYear()} Shipissh Inc.
      </div>
    </div>
  );
};

export default Sidebar;
