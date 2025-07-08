// src/admin/ShipmentTable.jsx
import React from "react";

const ShipmentTable = ({ shipments, onStatusUpdate }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full table-auto text-sm border border-gray-700">
        <thead className="bg-slate-700 text-left text-white">
          <tr>
            <th className="p-3">Tracking ID</th>
            <th className="p-3">Sender</th>
            <th className="p-3">Receiver</th>
            <th className="p-3">Created</th>
            <th className="p-3">Status</th>
            <th className="p-3">Update</th>
          </tr>
        </thead>
        <tbody className="text-white bg-slate-800">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="border-t border-gray-600">
              <td className="p-3">{shipment.trackingId}</td>
              <td className="p-3">{shipment.senderName}</td>
              <td className="p-3">{shipment.receiverName}</td>
              <td className="p-3">{shipment.createdAt?.toDate().toLocaleString()}</td>
              <td className="p-3">{shipment.status}</td>
              <td className="p-3">
                <select
                  className="bg-slate-700 text-white p-1 rounded border border-gray-600"
                  value={shipment.status}
                  onChange={(e) => onStatusUpdate(shipment.id, e.target.value)}
                >
                  <option>Created</option>
                  <option>Picked Up</option>
                  <option>In Transit</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentTable;
