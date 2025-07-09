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
    <div className="bg-white border border-blue-200 p-8 rounded-3xl shadow-md hover:shadow-lg transition-transform hover:scale-[1.01] max-w-2xl mx-auto my-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        📦 Create New Shipment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { name: "senderName", label: "Sender Name", type: "text", placeholder: "John Doe" },
          { name: "senderPhone", label: "Sender Phone", type: "tel", placeholder: "+91 9876543210" },
          { name: "receiverName", label: "Receiver Name", type: "text", placeholder: "Jane Smith" },
          { name: "receiverPhone", label: "Receiver Phone", type: "tel", placeholder: "+91 9123456789" },
        ].map(({ name, label, type, placeholder }) => (
          <div key={name}>
            <label className="block text-sm font-semibold text-blue-800 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={inputStyle}
              required
            />
          </div>
        ))}

        {/* Package Size */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Package Size</label>
          <select
            name="packageSize"
            value={formData.packageSize}
            onChange={handleChange}
            className={`${inputStyle} bg-white text-gray-800`}
            required
          >
            <option value="">Select package size</option>
            <option value="Small">Small (0–2kg)</option>
            <option value="Medium">Medium (2–5kg)</option>
            <option value="Large">Large (5–10kg)</option>
            <option value="Extra Large">Extra Large (10kg+)</option>
          </select>
        </div>

        {/* Textareas */}
        {[
          { name: "pickupAddress", label: "Pickup Address", placeholder: "1234 Main St, City, Pincode", rows: 3 },
          { name: "deliveryAddress", label: "Delivery Address", placeholder: "5678 Sector Rd, City, Pincode", rows: 3 },
          { name: "shipmentNote", label: "Shipment Note", placeholder: "e.g. Handle with care, fragile item", rows: 2 },
        ].map(({ name, label, placeholder, rows }) => (
          <div key={name}>
            <label className="block text-sm font-semibold text-blue-800 mb-1">{label}</label>
            <textarea
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              rows={rows}
              className={inputStyle}
              required={name !== "shipmentNote"}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Creating..." : "Create Shipment"}
        </button>
      </form>
    </div>
  );
};

const inputStyle =
  "w-full p-3 rounded-xl border border-blue-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white";

export default CreateShipment;
