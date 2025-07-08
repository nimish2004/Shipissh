import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsersAndShipments = async () => {
    try {
      // Fetch users
      const userSnap = await getDocs(collection(db, "users"));
      const userList = userSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Fetch all shipments
      const shipmentSnap = await getDocs(collection(db, "shipments"));
      const shipmentList = shipmentSnap.docs.map((doc) => ({ ...doc.data() }));

      // Count shipments for each user
      const userDataWithCount = userList.map((user) => {
        const orderCount = shipmentList.filter((ship) => ship.userId === user.uid).length;
        return { ...user, orderCount };
      });

      setUsers(userDataWithCount);
      setLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    fetchUsersAndShipments();
  }, []);

  if (loading) return <div className="text-center text-white p-6">Loading users...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">👥 Registered Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-700 text-sm text-left">
          <thead className="bg-slate-700 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">UID</th>
              <th className="p-3">Shipments Placed</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 text-white">
            {users.map((user) => (
              <tr key={user.uid} className="border-t border-gray-600 hover:bg-slate-700">
                <td className="p-3">{user.name || "N/A"}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 text-xs">{user.uid}</td>
                <td className="p-3 font-semibold text-cyan-400">{user.orderCount}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
