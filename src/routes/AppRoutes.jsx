import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Holdings from "../pages/Holdings";
import Trades from "../pages/Trades";
import ConnectExchange from "../pages/ConnectExchange";
import Layout from "../components/Layout";

export default function AppRoutes() {
  const { loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes with Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/holdings"
          element={
            <PrivateRoute>
              <Layout>
                <Holdings />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/trades"
          element={
            <PrivateRoute>
              <Layout>
                <Trades />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/connect"
          element={
            <PrivateRoute>
              <Layout>
                <ConnectExchange />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}