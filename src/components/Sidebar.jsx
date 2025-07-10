import { Link, useLocation } from "react-router-dom";
import { FiHome, FiPackage, FiSearch, FiUser, FiX } from "react-icons/fi";

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/create-shipment", label: "New Shipment", icon: <FiPackage /> },
    { to: "/track", label: "Track Shipment", icon: <FiSearch /> },
    { to: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-br from-white via-blue-50 to-blue-200 text-blue-800 flex flex-col justify-between shadow-md border-r border-blue-200">

      {/* Close button on mobile */}
      <div className="md:hidden flex justify-end p-4">
        <button onClick={onClose} className="text-blue-700 hover:text-red-500 text-2xl">
          <FiX />
        </button>
      </div>

      <div className="p-6 pt-0 md:pt-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-bold text-blue-700">Shipissh</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                ${
                  pathname === to
                    ? "bg-blue-600 text-white shadow"
                    : "hover:bg-blue-100 hover:text-blue-900"
                }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <footer className="p-4 text-xs text-blue-500 text-center border-t border-blue-100 mt-auto">
        © {new Date().getFullYear()} Shipissh Inc.
      </footer>
    </aside>
  );
};

export default Sidebar;
