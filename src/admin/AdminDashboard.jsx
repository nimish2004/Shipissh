import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchShipments = async () => {
    try {
      const snapshot = await getDocs(collection(db, "shipments"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShipments(data);
    } catch (err) {
      console.error("Error fetching shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const shipmentRef = doc(db, "shipments", id);
      await updateDoc(shipmentRef, { status: newStatus });
      fetchShipments();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-500">📦 Shipment Dashboard</h1>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading shipments...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700 bg-slate-900">
            <table className="min-w-full text-sm text-left text-white">
              <thead className="bg-slate-700 text-sm uppercase">
                <tr>
                  <th className="p-3">Tracking ID</th>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Receiver</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Update</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="border-t border-gray-700 hover:bg-slate-800"
                  >
                    <td className="p-3">{shipment.trackingId}</td>
                    <td className="p-3">{shipment.senderName}</td>
                    <td className="p-3">{shipment.receiverName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          shipment.status === "Delivered"
                            ? "bg-green-600"
                            : shipment.status === "Out for Delivery"
                            ? "bg-orange-500"
                            : shipment.status === "In Transit"
                            ? "bg-yellow-400 text-black"
                            : shipment.status === "Picked Up"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="p-3">{formatDate(shipment.createdAt)}</td>
                    <td className="p-3">
                      <select
                        className="bg-slate-700 border border-gray-600 p-1 rounded"
                        value={shipment.status}
                        onChange={(e) => updateStatus(shipment.id, e.target.value)}
                      >
                        <option value="Created">Created</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate(`/admin/update/${shipment.id}`)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded"
                      >
                        View/Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {shipments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-gray-400">
                      No shipments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
