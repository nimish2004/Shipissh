import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = ({ onLogout }) => {
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
    <header className="h-16 bg-[#1E293B] text-white flex items-center justify-between px-6 shadow border-b border-slate-700">
      {/* Logo */}
      <Link to="/dashboard">
        <h1 className="text-xl font-bold tracking-wide text-cyan-400 hover:text-cyan-300 transition">
          📦 Shipissh
        </h1>
      </Link>

      {/* Right section */}
      <div className="flex items-center gap-5">
        <Link
          to="/profile"
          className="flex items-center gap-2 group transition"
        >
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover border border-slate-500 group-hover:ring-2 group-hover:ring-cyan-500"
          />
          <span className="text-sm font-medium text-slate-200 group-hover:underline">
            {user.displayName}
          </span>
        </Link>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold transition shadow-sm"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
