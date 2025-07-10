import React, { useEffect, useState } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = ({ onLogout, onToggleSidebar }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        setUser({
          displayName: currentUser.displayName || "User",
          photoURL:
            currentUser.photoURL ||
            `https://ui-avatars.com/api/?name=${currentUser.displayName || currentUser.email}&background=0D8ABC&color=fff`,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="h-16 bg-gradient-to-r from-white via-blue-50 to-blue-100 text-blue-800 flex items-center justify-between px-6 shadow-md border-b border-blue-200">
      {/* Sidebar Toggle for Mobile */}
      <button onClick={onToggleSidebar} className="md:hidden text-blue-700 mr-3">
        <FiMenu size={24} />
      </button>

      <Link to="/dashboard" className="text-xl font-bold text-blue-700 tracking-tight hover:underline">
        Welcome Back {user.displayName || "User"}
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/profile" className="flex items-center gap-2 group">
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover border border-blue-300 group-hover:ring-2 group-hover:ring-blue-400"
          />
          <span className="text-sm font-medium group-hover:underline">
            {user.displayName}
          </span>
        </Link>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition shadow"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
 