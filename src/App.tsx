import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import PackageDetails from "@/pages/PackageDetails";
import AllPackages from "@/pages/AllPackages";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import MyBookings from "@/pages/MyBookings";
import Admin from "@/pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<AllPackages />} />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AuthProvider>
  );
}
