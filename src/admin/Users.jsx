import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsersAndShipments = async () => {
    try {
      const userSnap = await getDocs(collection(db, "users"));
      const shipmentSnap = await getDocs(collection(db, "shipments"));

      const userList = userSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const shipmentList = shipmentSnap.docs.map((doc) => ({ ...doc.data() }));

      const userDataWithCount = userList.map((user) => {
        const orderCount = shipmentList.filter((s) => s.userId === user.uid).length;
        return { ...user, orderCount };
      });

      setUsers(userDataWithCount);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndShipments();
  }, []);

  if (loading) return <div className="text-center text-gray-500 p-6">Loading users...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">👥 Registered Users</h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-blue-100 text-blue-800 uppercase tracking-wide">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Shipments</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-700">
            {users.map((user) => (
              <tr
                key={user.uid}
                className="border-t border-gray-200 hover:bg-blue-50 transition"
              >
                <td className="p-3 font-medium text-blue-900">{user.displayName || "N/A"}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 text-xs text-gray-500">{user.phone}</td>
                <td className="p-3 font-semibold text-blue-600">{user.orderCount}</td>
              </tr>
            ))} 

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
