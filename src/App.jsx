// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateShipment from "./components/Shipments/CreateShipment";
import TrackShipment from "./components/Shipments/TrackShipment"; 
import Layout from "./components/Layout";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./admin/AdminDashboard"; 
import ProtectedAdminRoute from "./components/Auth/ProtectedAdminRoute";
import UpdateShipment from "./admin/UpdateShipment";
import AdminLayout from "./admin/AdminLayout"; 
import Users from "./admin/Users";
import Home from "./pages/Home";

function App() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen text-slate-800">
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
  path="/admin"
  element={
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  }
/>
<Route
  path="/admin/update/:id"
  element={
    auth.currentUser?.email === "admin@example.com" ? (
      <AdminLayout><UpdateShipment /></AdminLayout>
    ) : (
      <Navigate to="/" />
    )
  }
/>
<Route
  path="/admin/users"
  element={
    <ProtectedAdminRoute>
      <AdminLayout>
        <Users />
      </AdminLayout>
    </ProtectedAdminRoute>
  }
/>



      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <Layout onLogout={handleLogout}>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/create-shipment"
        element={
          <Layout onLogout={handleLogout}>
            <CreateShipment />
            
          </Layout>
        }
      />
      <Route
  path="/track"
  element={
    <Layout onLogout={handleLogout}>
      <TrackShipment />
    </Layout>
  }
/>

<Route
  path="/profile"
  element={
    <Layout onLogout={handleLogout}>
      <UserProfile />
    </Layout>
  }
/>
    </Routes>
      </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);


export default AppWrapper;
