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
     <div className="flex-1 p-6 md:p-10 bg-white text-blue-800 min-h-screen rounded-3xl shadow-md hover:shadow-lg transition-transform">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">📦 Your Shipments</h1>

      {shipments.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-xl text-center text-blue-400 border border-blue-200 shadow-inner">
          No shipments found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedShipment(s)}
              className="cursor-pointer bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl shadow border border-blue-300 hover:shadow-lg transition"
            >
              <div className="text-xs text-blue-600 mb-1 font-mono">#{s.trackingId}</div>
              <h2 className="text-lg font-semibold text-blue-800 mb-1">{s.senderName}</h2>
              <p className="text-sm text-blue-700">→ {s.receiverName}</p>
              <p className="text-xs text-blue-500 mb-3">
                Size: <span className="font-medium">{s.packageSize}</span>
              </p>
              <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(s.status)}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedShipment && (
        <ShipmentModal shipment={selectedShipment} onClose={() => setSelectedShipment(null)} />
      )}
    </div>
  );
};

export default Dashboard;
