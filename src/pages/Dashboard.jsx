import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ShipmentModal from "../components/ShipmentModal";

const Dashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "shipments"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShipments(data);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "In Transit":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Created":
        return "bg-gray-200 text-gray-700";
      case "Picked Up":
        return "bg-blue-100 text-blue-700";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8">
      
      {/* Navbar style header */}
      <div className="flex justify-between items-center mb-10 px-4">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
          🚚 Shipissh Dashboard
        </h1>
        <span className="text-sm text-blue-500 font-medium">
          Welcome, {auth.currentUser?.displayName || "User"}
        </span>
      </div>

      {/* Shipments grid */}
      {shipments.length === 0 ? (
        <div className="bg-white/70 p-10 rounded-2xl shadow-lg text-center text-blue-500 border border-blue-200">
          No shipments found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedShipment(s)}
              className="cursor-pointer bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-blue-200 hover:scale-[1.015]"
            >
              <div className="text-xs text-blue-600 font-mono mb-1">#{s.trackingId}</div>
              <h2 className="text-lg font-semibold text-blue-800 mb-1">{s.senderName}</h2>
              <p className="text-sm text-blue-700">→ {s.receiverName}</p>
              <p className="text-xs text-blue-500 mt-1 mb-3">
                Size: <span className="font-medium">{s.packageSize}</span>
              </p>
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                  s.status
                )}`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedShipment && (
        <ShipmentModal shipment={selectedShipment} onClose={() => setSelectedShipment(null)} />
      )}
    </div>
  );
};

export default Dashboard;
