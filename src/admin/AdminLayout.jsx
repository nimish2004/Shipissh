import { Link, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();

  const navLink = (to, label, icon) => (
    <li>
      <Link
        to={to}
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
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-blue-200 shadow-md hidden md:flex flex-col p-6">
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-blue-600 mb-10">
          🚀 Admin Panel
        </h2>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navLink("/admin", "Shipments", "📦")}
            {navLink("/admin/users", "Users", "👤")}
            {navLink("/admin/settings", "Settings", "⚙️")}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-blue-100 pt-4 mt-10 text-xs text-blue-400 text-center">
          © 2025 <br />
          <span className="text-blue-600 font-semibold">Shipissh Pvt Ltd.</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow sticky top-0 z-10 p-4 flex justify-between items-center border-b border-blue-100">
          <h1 className="text-lg font-semibold text-blue-700">
            {pathname === "/admin"
              ? "Shipment Dashboard"
              : pathname.includes("/admin/update")
              ? "Update Shipment"
              : "Admin Panel"}
          </h1>

          <Link
            to="/"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Logout
          </Link>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-slate-100 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
