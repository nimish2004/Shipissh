// src/components/ShipmentModal.jsx
import React from "react";

const ShipmentModal = ({ shipment, onClose }) => {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-red-500 text-lg font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-blue-700">Shipment Details</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Tracking ID:</strong> {shipment.trackingId}</p>
          <p><strong>Status:</strong> {shipment.status}</p>
          <p><strong>Sender:</strong> {shipment.senderName} ({shipment.senderPhone})</p>
          <p><strong>Receiver:</strong> {shipment.receiverName} ({shipment.receiverPhone})</p>
          <p><strong>Package Size:</strong> {shipment.packageSize}</p>
          <p><strong>Pickup Address:</strong> {shipment.pickupAddress}</p>
          <p><strong>Delivery Address:</strong> {shipment.deliveryAddress}</p>
          <p><strong>Note:</strong> {shipment.shipmentNote || "None"}</p>
          <p><strong>Created At:</strong> {shipment.createdAt?.toDate().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ShipmentModal;
