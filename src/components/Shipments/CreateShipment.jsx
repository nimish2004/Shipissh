import { useState, useEffect } from "react";
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
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skipOtpVerification, setSkipOtpVerification] = useState(false); // To handle billing not enabled
  const navigate = useNavigate();

  // Cleanup reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth, // Firebase Auth instance
          "recaptcha-container", // ID of the container element
          {
            size: "invisible", // Invisible reCAPTCHA
            callback: (response) => {
              console.log("Recaptcha solved", response);
            },
            "expired-callback": () => {
              console.warn("Recaptcha expired. Resetting...");
              if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
              }
            },
          }
        );
        window.recaptchaVerifier.render(); // Render the reCAPTCHA widget
      } catch (error) {
        console.error("Error setting up recaptcha:", error);
        throw error;
      }
    }
  };

  const sendOtp = async () => {
    if (!formData.senderPhone) {
      alert("Please enter the sender's phone number.");
      return;
    }

    let phoneNumber = formData.senderPhone.trim().replace(/\s+/g, '');
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+91' + phoneNumber.replace(/^0/, ''); // Assuming Indian numbers, add +91
    }

    try {
      // Clear any existing reCAPTCHA instance before setting up a new one
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      console.log("Sending OTP to:", phoneNumber);
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      alert("OTP sent to sender's phone.");
    } catch (err) {
      console.error("OTP send error:", err);

      // Clean up recaptcha on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      let errorMessage = "Failed to send OTP. ";
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage += "Please enter a valid phone number with country code (e.g., +91xxxxxxxxxx).";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage += "Too many requests. Please try again later.";
      } else if (err.code === 'auth/captcha-check-failed') {
        errorMessage += "Captcha verification failed. Please try again.";
      } else if (err.code === 'auth/billing-not-enabled') {
        errorMessage += "Phone authentication requires Firebase Blaze plan. For development purposes, you can skip OTP verification.";
        
        const skip = confirm("Would you like to skip OTP verification for now? (Development mode only)");
        if (skip) {
          setSkipOtpVerification(true);
          setOtpSent(true);
          setConfirmationResult({ confirm: () => Promise.resolve() }); // Mock confirmation
          alert("OTP verification skipped. You can now create the shipment.");
        }
        return; // Exit after offering skip option
      } else {
        errorMessage += err.message;
      }
      alert(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!auth.currentUser) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    // Only require OTP verification if it wasn't skipped
    if (!confirmationResult && !skipOtpVerification) {
      alert("Please verify the sender's phone with OTP.");
      setLoading(false);
      return;
    }

    try {
      // Verify OTP first (only if OTP was sent and not skipped)
      if (confirmationResult && !skipOtpVerification) {
        await confirmationResult.confirm(otp);
        console.log("OTP verified successfully");
      } else {
        console.log("OTP verification skipped - no phone verification required");
      }

      // Create shipment with 'Payment Pending' status
      const docRef = await addDoc(collection(db, "shipments"), {
        ...formData,
        userId: auth.currentUser.uid,
        senderEmail: auth.currentUser.email,
        status: "Payment Pending", // Initial status for post-payment
        paymentStatus: "Unpaid",   // New field for payment tracking
        createdAt: Timestamp.now(),
        trackingId: `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        otpVerified: confirmationResult && !skipOtpVerification,
      });

      const successMessage = (confirmationResult && !skipOtpVerification)
        ? "Shipment created! Please proceed to payment. (Phone verified)"
        : "Shipment created! Please proceed to payment.";
      
      alert(successMessage);
      // Redirect to a payment page with the new shipment's ID
      navigate(`/payment/${docRef.id}`); 
    } catch (err) {
      console.error("Error creating shipment:", err);
      
      let errorMessage = "Error: ";
      if (err.code === 'auth/invalid-verification-code') {
        errorMessage += "Invalid OTP. Please check and try again.";
      } else if (err.code === 'auth/code-expired') {
        errorMessage += "OTP has expired. Please request a new one.";
      } else {
        errorMessage += err.message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-blue-200 p-8 rounded-3xl shadow-md max-w-2xl mx-auto my-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        📦 Create New Shipment
      </h2>

      {/* Invisible reCAPTCHA container - must be empty */}
      <div id="recaptcha-container" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sender Email (Auto-filled & Disabled) */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Sender Email</label>
          <input
            type="email"
            value={auth.currentUser?.email || ""}
            disabled
            className={`${inputStyle} bg-gray-100 cursor-not-allowed`}
          />
        </div>

        {/* Sender Name */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Sender Name</label>
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
          <label className="block text-sm font-semibold text-blue-800 mb-1">Sender Phone</label>
          <input
            type="tel"
            name="senderPhone"
            value={formData.senderPhone}
            onChange={handleChange}
            placeholder="+91xxxxxxxxxx"
            className={inputStyle}
            required
          />
          {!otpSent && ( // Show "Send OTP" button only if OTP not sent
            <div className="mt-3"> 
              <button
                type="button"
                onClick={sendOtp}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                Send OTP
              </button>
              <p className="text-xs text-gray-600 mt-2">
                📱 Phone verification is Temporarily off in dev mode.
              </p>
            </div>
          )}
        </div>

        {/* OTP Input (only show after sending OTP and if not skipped) */}
        {otpSent && !skipOtpVerification && (
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className={inputStyle}
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={sendOtp} // This should be for resend OTP
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
              >
                Resend OTP
              </button>
              <p className="text-xs text-gray-600 self-center">
                Didn't receive OTP? Click resend
              </p>
            </div>
          </div>
        )}

        {skipOtpVerification && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="text-sm">
              📱 <strong>Development Mode:</strong> OTP verification has been skipped.
              Phone verification is disabled due to Firebase billing requirements.
            </p>
          </div>
        )}

        {/* Receiver Name */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Receiver Name</label>
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
          <label className="block text-sm font-semibold text-blue-800 mb-1">Receiver Phone</label>
          <input
            type="tel"
            name="receiverPhone"
            value={formData.receiverPhone}
            onChange={handleChange}
            placeholder="+91xxxxxxxxxx"
            className={inputStyle}
            required
          />
        </div>

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
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Pickup Address</label>
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
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Delivery Address</label>
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
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Shipment Note</label>
          <textarea
            name="shipmentNote"
            value={formData.shipmentNote}
            onChange={handleChange}
            placeholder="e.g. Handle with care, fragile item"
            rows={2}
            className={inputStyle}
          />
        </div>

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