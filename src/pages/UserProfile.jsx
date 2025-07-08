import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiUser, FiMail, FiCalendar, FiEdit2 } from "react-icons/fi";

const storage = getStorage();

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("I’m a passionate user of Shipissh 🚚");
  const [joinedDate, setJoinedDate] = useState("");
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setJoinedDate(
          new Date(currentUser.metadata.creationTime).toLocaleDateString()
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    await updateProfile(auth.currentUser, { photoURL: downloadURL });
    setUser({ ...auth.currentUser, photoURL: downloadURL });
    setUploading(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName });
      setUser({ ...auth.currentUser, displayName });
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-white">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-slate-800 text-white p-8 rounded-xl shadow-lg mt-6 border border-slate-700">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <img
            src={
              user.photoURL ||
              `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=0D8ABC&color=fff`
            }
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-teal-500 shadow"
          />
          <label className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 text-white p-1.5 rounded-full cursor-pointer text-xs shadow transition">
            📷
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-teal-300 flex items-center gap-2">
            <FiUser />
            {editing ? (
              <input
                className="border-b border-teal-400 bg-transparent text-white text-lg font-medium focus:outline-none w-full"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            ) : (
              displayName || "No Display Name"
            )}
            <button
              className="ml-2 text-sm text-blue-400 hover:underline"
              onClick={() => setEditing(!editing)}
            >
              <FiEdit2 size={14} />
            </button>
          </h2>

          <p className="text-slate-300 flex items-center gap-2">
            <FiMail /> {user.email}
          </p>
          <p className="text-slate-400 flex items-center gap-2 text-sm">
            <FiCalendar /> Joined on {joinedDate}
          </p>

          <div>
            <label className="block font-medium text-sm text-slate-300 mb-1">
              About You
            </label>
            <textarea
              rows={3}
              className="w-full border border-slate-600 bg-slate-700 rounded-lg p-2 text-sm text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {editing && (
            <button
              onClick={handleSave}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
