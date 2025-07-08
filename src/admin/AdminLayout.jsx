import { Link, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* Sidebar */}
<aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col border-r border-slate-700 shadow-xl">
  {/* Title */}
  <h2 className="text-2xl font-extrabold text-cyan-400 mb-10">🚀 Admin Panel</h2>

  {/* Navigation */}
  <nav className="flex-1">
    <ul className="space-y-3">
      {/* Shipments (active) */}
      <li>
        <Link
          to="/admin"
          className={`block px-4 py-2 rounded-md font-medium transition-all ${
            pathname === "/admin"
              ? "hover:bg-cyan-600 text-white shadow"
              : "hover:bg-slate-800 hover:text-cyan-300"
          }`}
        >
          📦 Shipments
        </Link>
      </li>

      {/* Empty links - placeholder for future features */}
      <li>
         <Link
          to="/admin/users"
          className={`block px-4 py-2 rounded-md font-medium transition-all ${
            pathname === "/admin"
              ? "hover:bg-cyan-600 text-white shadow"
              : "hover:bg-slate-800 hover:text-cyan-300"
          }`}
        >
          👤 Users
        </Link>
      </li>
      <li>
         <Link
          to="/admin"
          className={`block px-4 py-2 rounded-md font-medium transition-all ${
            pathname === "/admin"
              ? "hover:bg-cyan-600 text-white shadow"
              : "hover:bg-slate-800 hover:text-cyan-300"
          }`}
        >
          ⚙️ Settings
        </Link>
      </li>
    </ul>
  </nav>

  {/* Divider + Footer */}
  <div className="border-t border-slate-700 pt-4 mt-8 text-sm text-gray-500 text-center">
    © 2025 <br />
    <span className="text-cyan-400 font-semibold"> Shipissh Pvt Ltd.</span>
  </div>
</aside>


      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Top Navbar */}
        <header className="bg-slate-900 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-100">
            {pathname === "/admin" ? "Shipment Dashboard" : "Update Shipment"}
          </h1>
          <Link
            to="/login"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Logout
          </Link>
        </header>

        {/* Main Page Content */}
        <main className="p-6 bg-slate-800 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
