import { Link, useLocation } from "react-router-dom";
import { FiHome, FiPackage, FiSearch, FiUser } from "react-icons/fi";

const Sidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/create-shipment", label: "New Shipment", icon: <FiPackage /> },
    { to: "/track", label: "Track Shipment", icon: <FiSearch /> },
    { to: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-200 text-blue-800 flex flex-col justify-between shadow-md border-r border-blue-200">
      {/* Top - Logo and nav */}
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo.png" alt="Shipissh Logo" className="w-10 h-10" />
          <span className="text-2xl font-bold tracking-tight text-blue-700">Shipissh</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
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
      <footer className="p-4 text-xs text-blue-500 text-center border-t border-blue-100">
        © {new Date().getFullYear()} Shipissh Inc.
      </footer>
    </aside>
  );
};

export default Sidebar;
