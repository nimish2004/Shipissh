import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaMapMarkedAlt, FaShieldAlt } from "react-icons/fa";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import LoginModal from "../components/Auth/LoginModal";
import SignupModal from "../components/Auth/SignupModal";


const Home = () => {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
const [showLogin, setShowLogin] = useState(false);
const [showSignup, setShowSignup] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShipment(null);

    try {
      const q = query(collection(db, "shipments"), where("trackingId", "==", trackingId.trim()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("No shipment found with this Tracking ID.");
      } else {
        setShipment(snapshot.docs[0].data());
      }
    } catch (err) {
      setError("Failed to fetch shipment. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col font-sans">
       {/* BIG Logo Background */}
  <img
    src="/logo.png"
    alt="Logo Background"
    className="absolute inset-0 mx-auto opacity-30 w-96 lg:w-[500px] top-20 z-0"
    style={{ pointerEvents: "none" }}
  />

      {/* Navbar */}
     <nav className="bg-gradient-to-r from-blue-50 via-white to-blue-100 px-8 py-4 shadow-md sticky top-0 z-50 border-b border-blue-200 flex justify-between items-center">
  {/* Logo + Brand */}
  <div className="flex items-center gap-3">
    <img src="/logo.png" alt="Shipissh Logo" className="w-10 h-10 object-contain" />
    <h1 className="text-2xl font-extrabold text-blue-700 tracking-wide">
      Shipissh
    </h1>
  </div>

 

  {/* Auth Buttons */}
  <div className="space-x-3">
    <button
      onClick={() => setShowLogin(true)}
      className="text-blue-700 hover:text-white hover:bg-blue-500 px-4 py-2 rounded-lg font-medium border border-blue-500 transition"
    >
      Login
    </button>
    <button
      onClick={() => setShowSignup(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
    >
      Sign Up
    </button>
  </div>
</nav>



      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-white via-red-100 to-blue-500">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
              Smart. Secure. Real-Time.
            </h2>
            <p className="text-lg text-gray-700 max-w-xl">
              Manage shipments, track deliveries, and streamline logistics —
              all in one fast, reliable platform.
            </p>
          </div>

          {/* Right: Tracking Box */}
          <div className="flex-1 bg-white shadow-xl rounded-xl p-6 border border-gray-200 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              📍 Track Your Shipment
            </h3>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Enter Tracking ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                {loading ? "Searching..." : "Track"}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center border border-red-300">
                {error}
              </div>
            )}

            {shipment && (
              <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded border border-blue-200 text-sm">
                <p><strong>Tracking ID:</strong> {shipment.trackingId}</p>
                <p><strong>Sender:</strong> {shipment.senderName}</p>
                <p><strong>Receiver:</strong> {shipment.receiverName}</p>
                <p><strong>Status:</strong> {shipment.status}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">Why Choose Shipissh ?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow">
              <FaBoxOpen className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-blue-800">Easy Shipment Creation</h3>
              <p className="text-gray-700">Create shipments instantly with secure and scalable database support.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow">
              <FaMapMarkedAlt className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-blue-800">Live Package Tracking</h3>
              <p className="text-gray-700">Track your parcel from pickup to doorstep with real-time updates.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow">
              <FaShieldAlt className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-blue-800">Secure & Trusted</h3>
              <p className="text-gray-700">Firebase-based backend ensures encrypted access and user safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ese Hi*/}
     <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-extrabold text-blue-800 mb-4">
      🚀 How It Works
    </h2>
    <p className="text-lg text-gray-600 mb-12">
      Getting your shipment delivered is as easy as 1-2-3.
    </p>

    <div className="grid md:grid-cols-3 gap-10">
      {/* Step 1 */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border-t-4 border-blue-500 hover:scale-105 hover:shadow-xl transition-all">
        <div className="text-5xl mb-4 text-blue-600">📦</div>
        <h3 className="text-xl font-semibold text-blue-800 mb-2">
          1. Create Shipment
        </h3>
        <p className="text-gray-600">
          Fill in sender & receiver details, select package size and confirm.
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border-t-4 border-yellow-400 hover:scale-105 hover:shadow-xl transition-all">
        <div className="text-5xl mb-4 text-yellow-500">📍</div>
        <h3 className="text-xl font-semibold text-yellow-600 mb-2">
          2. Real-Time Tracking
        </h3>
        <p className="text-gray-600">
          Instantly track your parcel from pickup to delivery.
        </p>
      </div>

      {/* Step 3 */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border-t-4 border-green-500 hover:scale-105 hover:shadow-xl transition-all">
        <div className="text-5xl mb-4 text-green-600">✅</div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          3. Fast Delivery
        </h3>
        <p className="text-gray-600">
          Enjoy prompt, doorstep delivery with full transparency.
        </p>
      </div>
    </div>
  </div>
</section>



{/* why us */}
<section className="bg-gradient-to-r from-blue-100 via-white to-blue-50 py-20 px-6 text-center">
  <div className="max-w-4xl mx-auto">
    <h1 className="text-5xl font-extrabold text-blue-800 mb-4">
      Shipissh — Trusted by Millions 🌍
    </h1>
    <p className="text-xl text-gray-700 mb-8">
      World’s No. 1 Logistics & Delivery Platform. Reliable. Fast. Transparent.
    </p>

    <a
      href="#"
      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-blue-700 transition"
    >
      🔍 Track Your Shipment
    </a>
  </div>
</section>




      {/* Footer */}
      <footer className="bg-blue-50 border-t border-blue-100 text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h3 className="font-semibold text-blue-700 text-lg mb-3">Shipissh</h3>
          <p className="text-gray-600">
            A powerful, secure, and easy-to-use shipment tracking solution built with modern tech.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold text-blue-700 mb-3">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
            <li><Link to="/" className="hover:text-blue-500">About</Link></li>
            <li><Link to="/" className="hover:text-blue-500">Services</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-blue-700 mb-3">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500">Track Shipment</a></li>
            <li><Link to="/" className="hover:text-blue-500">Contact Us</Link></li>
            <li><a href="mailto:support@shipsecure.com" className="hover:text-blue-500">support@shipissh.com</a></li>
          </ul>
        </div>

        {/* Legal + Social */}
        <div>
          <h4 className="font-semibold text-blue-700 mb-3">Legal & Social</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-500">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-blue-500">Terms of Service</Link></li>
          </ul>
          <div className="flex gap-4 mt-4 text-blue-700 text-xl">
            <a href="#"><FaFacebookF className="hover:text-blue-500" /></a>
            <a href="#"><FaTwitter className="hover:text-sky-500" /></a>
            <a href="#"><FaInstagram className="hover:text-pink-600" /></a>
            <a href="https://www.linkedin.com/in/nimish-berwal-05656324b/"><FaLinkedin className="hover:text-blue-600" /></a>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="text-center py-5 border-t border-blue-100 bg-blue-100 text-gray-600">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-700">Shipissh</span> by Nimish | All rights reserved.
      </div>
    </footer>
{showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
{showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
    </div>
  );
  
};

export default Home;
