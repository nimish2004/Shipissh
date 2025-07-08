import { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();
  const storage = getStorage();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bio: "I’m a passionate user of Shipissh 🚚",
  });

  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
  e.preventDefault();
  setError("");

  if (formData.password !== formData.confirmPassword) {
    return setError("Passwords do not match.");
  }

  setLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    const user = userCredential.user;
    let photoURL = "";

    if (photo) {
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(storageRef, photo);
      photoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(user, {
      displayName: formData.displayName,
      photoURL:
        photoURL ||
        `https://ui-avatars.com/api/?name=${formData.displayName}&background=0D8ABC&color=fff`,
    });

    // ✅ Save user in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: formData.displayName,
      email: formData.email,
      photoURL:
        photoURL ||
        `https://ui-avatars.com/api/?name=${formData.displayName}&background=0D8ABC&color=fff`,
      createdAt: Timestamp.now(),
    });

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    setError(err.message);
  }

  setLoading(false);
};  

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
      <div className="w-full max-w-md p-8 bg-slate-800 text-white rounded-xl shadow-xl border border-slate-700 space-y-6">
        <div className="flex flex-col items-center">
          <img src="/vite.svg" alt="Logo" className="w-14 h-14 mb-2" />
          <h1 className="text-2xl font-bold text-teal-400">Create Account</h1>
        </div>

        {error && (
          <p className="text-center text-red-400 text-sm animate-pulse">
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="displayName"
            placeholder="Full Name"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <textarea
            name="bio"
            placeholder="Short Bio (optional)"
            value={formData.bio}
            onChange={handleChange}
            rows={2}
            className="w-full p-2 bg-slate-700 border border-slate-600 text-white text-sm rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full text-sm text-slate-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-semibold transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-400 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
