import { useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ShipmentModal from "../ShipmentModal";

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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
        setModalOpen(true); // Open modal
      }
    } catch (err) {
      console.error("Error searching shipment:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white text-blue-800 p-8 rounded-3xl shadow border border-blue-200 mt-10">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        📦 Track Your Shipment
      </h2>

      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter Tracking ID (e.g. TRK-ABC123XYZ)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="w-full p-3 rounded-lg border border-blue-300 placeholder-gray-500 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-semibold transition shadow"
        >
          {loading ? "🔎 Searching..." : "🔍 Track Shipment"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
      )}

      {shipment && modalOpen && (
        <ShipmentModal shipment={shipment} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default TrackShipment;