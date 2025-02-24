import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // For routing
import Navbar from "./components/Navbar"; // Navbar component
import Footer from "./components/Footer"; // Footer component
import Home from "./pages/Home"; // Home page
import Profile from "./pages/Profile"; // Profile page
import Register from "./pages/Register"; // Register page
import Dashboard from "./components/Dashboard"; // Dashboard page
import Browse from "./pages/Browse"; // Browse page
import Watch from "./pages/Watch"; // Watch page
import Subscription from "./pages/Subscription"; // Subscription page
import ProtectedRoute from "./routes/ProtectedRoute"; // Protected routes
import Login from "./components/Auth/Login";
import { AuthProvider } from "./context/AuthContext"; // AuthContext provider

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Navbar */}
          <Navbar />

          {/* Main content */}
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/watch/:id" element={<Watch />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
