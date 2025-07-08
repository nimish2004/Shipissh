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

  useEffect(() => {
    const fetchShipment = async () => {
      const ref = doc(db, "shipments", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setShipment(snap.data());
        setNewStatus(snap.data().status);
        setAdminNote(snap.data().adminNote || "");
      }
    };
    fetchShipment();
  }, [id]);

  const handleUpdate = async () => {
    const ref = doc(db, "shipments", id);
    await updateDoc(ref, {
      status: newStatus,
      adminNote: adminNote.trim(),
    });
    alert("Shipment updated successfully");
  };

  if (!shipment) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 text-white p-8 mt-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Update Shipment</h2>
      <p><strong>Tracking ID:</strong> {shipment.trackingId}</p>
      <p><strong>Sender:</strong> {shipment.senderName}</p>
      <p><strong>Receiver:</strong> {shipment.receiverName}</p>
      <p><strong>Current Status:</strong> {shipment.status}</p>

      <div className="mt-4">
        <label className="block text-sm font-semibold mb-1">New Status</label>
        <select
          className="w-full bg-slate-800 border border-gray-600 rounded p-2"
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

      <div className="mt-4">
        <label className="block text-sm font-semibold mb-1">Admin Note</label>
        <textarea
          rows={3}
          className="w-full bg-slate-800 border border-gray-600 rounded p-2"
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          placeholder="Optional note for internal use"
        />
      </div>

      <button
        className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded"
        onClick={handleUpdate}
      >
        Update Shipment
      </button>
    </div>
  );
};

export default UpdateShipment;
// This component allows an admin to update the status and add notes to a shipment.