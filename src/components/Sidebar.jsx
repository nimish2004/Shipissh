import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiSearch,
  FiUser
} from "react-icons/fi";

const Sidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/create-shipment", label: "New Shipment", icon: <FiPackage /> },
    { to: "/track", label: "Track Shipment", icon: <FiSearch /> },
    { to: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-200 text-blue-800 flex flex-col justify-between shadow-lg border-r border-blue-200">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <img src="logo.png" alt="Logo" className="w-12 h-12" />
          <span className="text-2xl font-bold tracking-wide text-blue-600">
            Shipissh
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition duration-200 group
              ${
                pathname === to
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-blue-800 hover:bg-blue-100 hover:text-blue-900"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="tracking-wide">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 text-xs text-blue-500 text-center border-t border-blue-100">
        © {new Date().getFullYear()} Shipissh Inc.
      </div>
    </div>
  );
};

export default Sidebar;
