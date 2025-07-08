import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateShipment = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    receiverName: "",
    receiverPhone: "",
    packageSize: "",
    pickupAddress: "",
    deliveryAddress: "",
    shipmentNote: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!auth.currentUser) {
      alert("You must be logged in to create a shipment.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "shipments"), {
        ...formData,
        userId: auth.currentUser.uid,
        status: "Created",
        createdAt: Timestamp.now(),
        trackingId: `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      });

      alert("Shipment created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating shipment:", err.code, err.message);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 text-white p-8 rounded-2xl shadow-lg border border-slate-600">
      <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
        📦 Create New Shipment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
        {/* Sender Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Sender Name</label>
          <input
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={handleChange}
            placeholder="John Doe"
            className={inputStyle}
            required
          />
        </div>

        {/* Sender Phone */}
        <div>
          <label className="block text-sm font-semibold mb-1">Sender Phone</label>
          <input
            type="tel"
            name="senderPhone"
            value={formData.senderPhone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className={inputStyle}
            required
          />
        </div>

        {/* Receiver Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Receiver Name</label>
          <input
            type="text"
            name="receiverName"
            value={formData.receiverName}
            onChange={handleChange}
            placeholder="Jane Smith"
            className={inputStyle}
            required
          />
        </div>

        {/* Receiver Phone */}
        <div>
          <label className="block text-sm font-semibold mb-1">Receiver Phone</label>
          <input
            type="tel"
            name="receiverPhone"
            value={formData.receiverPhone}
            onChange={handleChange}
            placeholder="+91 9123456789"
            className={inputStyle}
            required
          />
        </div>

        {/* Package Size */}
        <div>
          <label className="block text-sm font-semibold mb-1">Package Size</label>
          <select
            name="packageSize"
            value={formData.packageSize}
            onChange={handleChange}
            className={`${inputStyle} bg-slate-700 text-white`}
            required
          >
            <option value="">Select package size</option>
            <option value="Small">Small (0–2kg)</option>
            <option value="Medium">Medium (2–5kg)</option>
            <option value="Large">Large (5–10kg)</option>
            <option value="Extra Large">Extra Large (10kg+)</option>
          </select>
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block text-sm font-semibold mb-1">Pickup Address</label>
          <textarea
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            placeholder="1234 Main St, City, Pincode"
            rows={3}
            className={inputStyle}
            required
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block text-sm font-semibold mb-1">Delivery Address</label>
          <textarea
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            placeholder="5678 Sector Rd, City, Pincode"
            rows={3}
            className={inputStyle}
            required
          />
        </div>

        {/* Shipment Note */}
        <div>
          <label className="block text-sm font-semibold mb-1">Shipment Note</label>
          <textarea
            name="shipmentNote"
            value={formData.shipmentNote}
            onChange={handleChange}
            placeholder="e.g. Handle with care, fragile item"
            rows={2}
            className={inputStyle}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-lg font-semibold shadow transition"
        >
          {loading ? "Creating..." : "Create Shipment"}
        </button>
      </form>
    </div>
  );
};

// Input style reused across fields
const inputStyle =
  "w-full p-3 rounded-lg bg-slate-700 border border-slate-500 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition";

export default CreateShipment;
