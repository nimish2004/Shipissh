import React from "react";

const ShipmentTable = ({ shipments, onStatusUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-700";
      case "In Transit":
        return "bg-yellow-100 text-yellow-800";
      case "Picked Up":
        return "bg-blue-100 text-blue-700";
      case "Created":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (timestamp) => {
    try {
      return timestamp?.toDate().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }) || "N/A";
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="overflow-x-auto mt-6 rounded-xl border border-blue-200 bg-white shadow-md">
      <table className="w-full min-w-[600px] text-sm text-left text-blue-900">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-semibold border-b border-blue-200">
          <tr>
            <th className="p-3">Tracking ID</th>
            <th className="p-3">Sender</th>
            <th className="p-3">Receiver</th>
            <th className="p-3">Created</th>
            <th className="p-3">Status</th>
            <th className="p-3">Update</th>
          </tr>
        </thead>
        <tbody>
          {shipments.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No shipments found.
              </td>
            </tr>
          ) : (
            shipments.map((shipment) => (
              <tr
                key={shipment.id}
                className="border-t border-blue-100 hover:bg-blue-50 transition"
              >
                <td className="p-3 font-mono text-sm">{shipment.trackingId}</td>
                <td className="p-3">{shipment.senderName}</td>
                <td className="p-3">{shipment.receiverName}</td>
                <td className="p-3 text-gray-700 text-sm">
                  {formatDate(shipment.createdAt)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {shipment.status}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={shipment.status}
                    onChange={(e) => onStatusUpdate(shipment.id, e.target.value)}
                    className="cursor-pointer px-2 py-1 border border-blue-300 rounded-md bg-white text-sm text-blue-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Created">Created</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentTable;
