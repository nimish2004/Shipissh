import { useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShipment(null);
    setError("");

    try {
      const q = query(
        collection(db, "shipments"),
        where("trackingId", "==", trackingId.trim())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No shipment found with this tracking ID.");
      } else {
        const doc = querySnapshot.docs[0];
        setShipment({ id: doc.id, ...doc.data() });
      }
    } catch (err) {
      console.error("Error searching shipment:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-800 text-white p-8 rounded-2xl shadow-lg border border-slate-600 mt-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
        📦 Track Your Shipment
      </h2>

      {/* Form */}
      <form onSubmit={handleSearch} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Enter Tracking ID (e.g. TRK-ABC123XYZ)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-lg font-semibold shadow transition"
        >
          {loading ? "🔎 Searching..." : "🔍 Track Shipment"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 mt-4 text-center font-medium">{error}</p>
      )}

      {/* Shipment Details */}
      {shipment && (
        <div className="mt-6 bg-slate-700 p-6 rounded-xl border border-slate-500 shadow-md">
          <div className="text-sm text-slate-300 mb-1">
            <span className="text-gray-400">Tracking ID:</span>{" "}
            <span className="font-mono text-white">{shipment.trackingId}</span>
          </div>
          <div className="text-lg font-bold text-cyan-400">
            {shipment.senderName} → {shipment.receiverName}
          </div>
          <div className="text-sm text-slate-300 mb-2">
            Package Size: <span className="text-white">{shipment.packageSize}</span>
          </div>
          <div className="text-sm font-medium text-green-400">
            Status: {shipment.status}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackShipment;
