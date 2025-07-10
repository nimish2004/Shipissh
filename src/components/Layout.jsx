import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 text-blue-900 ">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={onLogout} />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
