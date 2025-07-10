import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
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

  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Recaptcha Setup
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("Recaptcha verified");
          },
        },
        auth // ✅ Correctly pass the auth instance here
      );
    }
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    if (!formData.senderPhone) {
      alert("Please enter sender's phone number first.");
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, formData.senderPhone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      alert("OTP sent to sender's phone.");
    } catch (error) {
      console.error("OTP error:", error);
      alert("Failed to send OTP: " + error.message);
    }
  };

  // ✅ Verify OTP and Create Shipment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!auth.currentUser) {
      alert("You must be logged in to create a shipment.");
      setLoading(false);
      return;
    }

    if (!confirmationResult) {
      alert("Please verify the sender's phone first.");
      setLoading(false);
      return;
    }

    try {
      // Verify OTP first
      await confirmationResult.confirm(otp);

      await addDoc(collection(db, "shipments"), {
        ...formData,
        userId: auth.currentUser.uid,
        senderEmail: auth.currentUser.email,
        status: "Created",
        createdAt: Timestamp.now(),
        trackingId: `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      });

      alert("Shipment created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-blue-200 p-8 rounded-3xl shadow-md max-w-2xl mx-auto my-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        📦 Create New Shipment
      </h2>

      <div id="recaptcha-container"></div> {/* 🔐 Recaptcha here */}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email (auto-filled) */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Sender Email</label>
          <input
            type="email"
            value={auth.currentUser?.email || ""}
            disabled
            className={`${inputStyle} bg-gray-100 cursor-not-allowed`}
          />
        </div>

        {/* Inputs */}
        {[
          { name: "senderName", label: "Sender Name", type: "text" },
          { name: "senderPhone", label: "Sender Phone", type: "tel" },
          { name: "receiverName", label: "Receiver Name", type: "text" },
          { name: "receiverPhone", label: "Receiver Phone", type: "tel" },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="block text-sm font-semibold text-blue-800 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={inputStyle}
              required
            />
            
          </div>
        ))}

        {/* Send OTP Button */}
        {!otpSent && (
          <button
            type="button"
            onClick={sendOtp}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            Send OTP to Sender
          </button>
        )}

        {/* OTP Input (only show after sending OTP) */}
        {otpSent && (
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={inputStyle}
              required
            />
          </div>
        )}

        {/* Package Size */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Package Size</label>
          <select
            name="packageSize"
            value={formData.packageSize}
            onChange={handleChange}
            className={inputStyle}
            required
          >
            <option value="">Select size</option>
            <option value="Small">Small (0–2kg)</option>
            <option value="Medium">Medium (2–5kg)</option>
            <option value="Large">Large (5–10kg)</option>
            <option value="Extra Large">Extra Large (10kg+)</option>
          </select>
        </div>

        {/* Addresses */}
        {[
          { name: "pickupAddress", label: "Pickup Address", rows: 3 },
          { name: "deliveryAddress", label: "Delivery Address", rows: 3 },
          { name: "shipmentNote", label: "Shipment Note", rows: 2 },
        ].map(({ name, label, rows }) => (
          <div key={name}>
            <label className="block text-sm font-semibold text-blue-800 mb-1">{label}</label>
            <textarea
              name={name}
              value={formData[name]}
              onChange={handleChange}
              rows={rows}
              className={inputStyle}
              required={name !== "shipmentNote"}
            />
          </div>
        ))}

        {/* Submit */}
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
