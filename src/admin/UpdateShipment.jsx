// src/admin/UpdateShipment.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const UpdateShipment = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const ref = doc(db, "shipments", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setShipment(snap.data());
          setNewStatus(snap.data().status);
          setAdminNote(snap.data().adminNote || "");
        }
      } catch (err) {
        console.error("Error fetching shipment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const ref = doc(db, "shipments", id);
      await updateDoc(ref, {
        status: newStatus,
        adminNote: adminNote.trim(),
      });
      alert("Shipment updated successfully ✅");
    } catch (err) {
      console.error("Error updating shipment:", err);
      alert("Failed to update shipment ❌");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (!shipment) {
    return <div className="text-center text-red-500">Shipment not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white text-slate-800 p-8 mt-8 rounded-xl border border-blue-200 shadow">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">✏️ Update Shipment</h2>

      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">📦 Tracking ID:</span> <span className="font-mono">{shipment.trackingId}</span></p>
        <p><span className="font-semibold">📤 Sender:</span> {shipment.senderName}</p>
        <p><span className="font-semibold">📥 Receiver:</span> {shipment.receiverName}</p>
        <p><span className="font-semibold">📍 Current Status:</span> {shipment.status}</p>
      </div>

      {/* Status Dropdown */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Update Status</label>
        <select
          className="w-full border border-blue-300 rounded-md p-2 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option>Created</option>
          <option>Picked Up</option>
          <option>In Transit</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
        </select>
      </div>

      {/* Admin Note */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Admin Note</label>
        <textarea
          rows={3}
          className="w-full border border-blue-300 rounded-md p-2 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          placeholder="Optional note for internal or delivery team"
        />
      </div>

      {/* Submit Button */}
      <button
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition shadow"
        onClick={handleUpdate}
      >
        💾 Update Shipment
      </button>
    </div>
  );
};

export default UpdateShipment;
