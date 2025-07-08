import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const Dashboard = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const q = query(
          collection(db, "shipments"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShipments(data);
      } catch (err) {
        console.error("Failed to fetch shipments:", err);
      }
    };

    fetchShipments();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const shipmentRef = doc(db, "shipments", id);
      await updateDoc(shipmentRef, { status: newStatus });
      setShipments((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 bg-[#0F172A] text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">📦 Your Shipments</h1>

      {shipments.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-xl text-center text-gray-400 border border-slate-700 shadow-inner">
          No shipments found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((s) => (
            <div
              key={s.id}
              className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-2xl shadow-md border border-slate-600 transition-transform hover:scale-[1.01]"
            >
              <div className="text-sm text-gray-400 mb-1">
                📦 <span className="font-mono">#{s.trackingId}</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-1">
                {s.senderName}
              </h2>
              <p className="text-sm text-gray-300 mb-1">→ {s.receiverName}</p>
              <p className="text-xs text-gray-500 mb-4">
                Size: <span className="font-medium">{s.packageSize}</span>
              </p>

              <p className="text-sm font-semibold text-green-400 mb-2">
                Status: {s.status}
              </p>
              <select
                value={s.status}
                onChange={(e) => updateStatus(s.id, e.target.value)}
                className="w-full p-2 rounded-lg text-sm bg-slate-900 text-white border border-slate-600 focus:ring-2 focus:ring-teal-500 transition"
              >
                <option value="Created">Created</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
