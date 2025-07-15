import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Payment = () => {
    const { shipmentId } = useParams();
    const navigate = useNavigate();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Fetch shipment details
    useEffect(() => {
        const fetchShipment = async () => {
            if (!shipmentId) {
                setError("No shipment ID provided.");
                setLoading(false);
                return;
            }
            try {
                const shipmentRef = doc(db, "shipments", shipmentId);
                const docSnap = await getDoc(shipmentRef);

                if (docSnap.exists()) {
                    setShipment({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("Shipment not found.");
                }
            } catch (err) {
                console.error("Error fetching shipment:", err);
                setError("Failed to fetch shipment details.");
            } finally {
                setLoading(false);
            }
        };

        fetchShipment();
    }, [shipmentId]);

    // Function to load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    // Handle the payment process
    const handlePayment = async () => {
        setPaymentLoading(true);
        const res = await loadRazorpayScript();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            setPaymentLoading(false);
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: 5000000, 
            currency: "INR",
            name: "Shipissh",
            description: `Payment for Shipment: ${shipment.trackingId}`,
            image: "/logo.png",
            handler: async function (response) {
                try {
                    // On success, update Firestore
                    const shipmentRef = doc(db, "shipments", shipmentId);
                    await updateDoc(shipmentRef, {
                        paymentStatus: "Paid",
                        paymentId: response.razorpay_payment_id,
                        status: "Created", // Update shipment status
                    });
                    alert("Payment successful! Your shipment is confirmed.");
                    navigate("/dashboard");
                } catch (err) {
                    console.error("Error updating payment status:", err);
                    alert("Payment successful, but failed to update status. Please contact support.");
                }
            },
            prefill: {
                name: shipment.senderName,
                email: auth.currentUser.email,
                contact: shipment.senderPhone,
            },
            notes: {
                shipmentId: shipment.id,
            },
            theme: {
                color: "#2563EB", // Blue theme
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response) {
            alert("Payment failed. Please try again.");
            console.error(response.error);
        });
        paymentObject.open();
        setPaymentLoading(false);
    };

    if (loading) {
        return <div className="text-center py-10">Loading shipment details...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Complete Your Payment</h2>
            {shipment && (
                <div className="space-y-3 text-gray-700">
                    <p><strong>Tracking ID:</strong> {shipment.trackingId}</p>
                    <p><strong>Package:</strong> {shipment.packageSize}</p>
                    <p><strong>From:</strong> {shipment.senderName}</p>
                    <p><strong>To:</strong> {shipment.receiverName}</p>
                    <hr className="my-4" />
                    <p className="text-xl font-bold"><strong>Total Amount:</strong> ₹50.00</p>
                    <button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
                    >
                        {paymentLoading ? "Processing..." : "Pay Now"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Payment;