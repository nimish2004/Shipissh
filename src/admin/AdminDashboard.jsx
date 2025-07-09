import { useEffect, useState } from "react";
import React from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
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
      <div className="w-full p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">📦 Shipment Dashboard</h1>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading shipments...</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-blue-200 shadow-lg bg-white">
            <table className="min-w-full text-sm text-left text-blue-900">
              <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">Tracking ID</th>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Receiver</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Update</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
  {shipments.map((shipment) => (
    <React.Fragment key={shipment.id}>
      <tr
        className="border-t border-blue-100 hover:bg-blue-50 cursor-pointer transition duration-200"
        onClick={() =>
          setSelectedShipmentId(
            selectedShipmentId === shipment.id ? null : shipment.id
          )
        }
      >
        <td className="p-4 font-mono text-sm">{shipment.trackingId}</td>
        <td className="p-4">{shipment.senderName}</td>
        <td className="p-4">{shipment.receiverName}</td>
        <td className="p-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              shipment.status === "Delivered"
                ? "bg-green-100 text-green-800"
                : shipment.status === "Out for Delivery"
                ? "bg-orange-100 text-orange-700"
                : shipment.status === "In Transit"
                ? "bg-yellow-100 text-yellow-700"
                : shipment.status === "Picked Up"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {shipment.status}
          </span>
        </td>
        <td className="p-4">{formatDate(shipment.createdAt)}</td>
        <td className="p-4">
          <select
            className="bg-white border border-blue-300 rounded-md p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <td className="p-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent row toggle
              navigate(`/admin/update/${shipment.id}`);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-md font-semibold shadow-sm transition"
          >
            View/Edit
          </button>
        </td>
      </tr>

      {/* Expandable Details Row */}
      {selectedShipmentId === shipment.id && (
        <tr className="bg-blue-50 border-t border-blue-200 text-sm">
          <td colSpan="7" className="p-4 text-blue-900">
            <div className="grid md:grid-cols-2 gap-4">
              <p><span className="font-medium">Sender Contact:</span> {shipment.senderPhone}</p>
              <p><span className="font-medium">Receiver Contact:</span> {shipment.receiverPhone}</p>
              <p><span className="font-medium">Package Size:</span> {shipment.packageSize}</p>
              <p><span className="font-medium">Pickup Address:</span> {shipment.pickupAddress}</p>
              <p><span className="font-medium">Delivery Address:</span> {shipment.deliveryAddress}</p>
              <p><span className="font-medium">Created At:</span> {formatDate(shipment.createdAt)}</p>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Shipment Modal */}
        {selectedShipment && (
          <ShipmentModal
            shipment={selectedShipment}
            onClose={() => setSelectedShipment(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
