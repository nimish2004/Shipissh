import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLink = (to, label, icon) => (
    <li>
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
          pathname === to
            ? "bg-blue-100 text-blue-700 shadow-inner"
            : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"
        }`}
      >
        {icon} {label}
      </Link>
    </li>
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-blue-200 shadow-md p-6">
        <h2 className="text-2xl font-extrabold text-blue-600 mb-10">🚀 Admin Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navLink("/admin", "Shipments", "📦")}
            {navLink("/admin/users", "Users", "👤")}
            {navLink("/admin/settings", "Settings", "⚙️")}
          </ul>
        </nav>
        <div className="border-t border-blue-100 pt-4 mt-10 text-xs text-blue-400 text-center">
          © 2025 <br />
          <span className="text-blue-600 font-semibold">Shipissh Pvt Ltd.</span>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-white w-64 h-full shadow-md transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-blue-100">
          <h2 className="text-xl font-bold text-blue-600">🚀 Admin Panel</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <IoClose size={24} className="text-blue-700" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navLink("/admin", "Shipments", "📦")}
            {navLink("/admin/users", "Users", "👤")}
            {navLink("/admin/settings", "Settings", "⚙️")}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar */}
        <header className="bg-white shadow sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-blue-100">
          {/* Sidebar toggle button (visible on mobile only) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-blue-600 mr-3"
          >
            <FiMenu size={22} />
          </button>

          <h1 className="text-lg font-semibold text-blue-700 flex-1">
            {pathname === "/admin"
              ? "Shipment Dashboard"
              : pathname.includes("/admin/update")
              ? "Update Shipment"
              : "Admin Panel"}
          </h1>

          <Link
            to="/"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition ml-4"
          >
            Logout
          </Link>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 bg-slate-100 min-h-[calc(100vh-64px)] w-full overflow-x-hidden">
  {children}
</main>

      </div>
    </div>
  );
};

export default AdminLayout;
