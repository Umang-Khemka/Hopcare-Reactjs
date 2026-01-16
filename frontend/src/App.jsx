import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
import { authStore } from "./store/auth.store.js";

import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

import UserProfilePage from "./pages/PatientPages/UserProfilePage.jsx";
import PatientDashboard from "./pages/PatientPages/PatientDashboard.jsx";
import FindDocPage from "./pages/PatientPages/FindDocPage.jsx";
import AppointmentPage from "./pages/PatientPages/AppointmentPage.jsx";
import PrescriptionPage from "./pages/PatientPages/PrescriptionsPage.jsx";

import DocProfilePage from "./pages/DoctorPages/DocProfilePage.jsx";
import DocDashboardPage from "./pages/DoctorPages/DocDashboardPage.jsx";
import CalendarPage from "./pages/DoctorPages/CalendarPage.jsx";
import HistoryPage from "./pages/DoctorPages/HistoryPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import RoleRedirect from "./components/RoleRedirect.jsx";
import PatientHistory from "./pages/DoctorPages/PatientHistory.jsx";

function App() {
  const checkAuth = authStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RoleRedirect>
              <LandingPage />
            </RoleRedirect>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/find" element={<FindDocPage />} />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["patient"]}>
                <UserProfilePage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointment"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["patient"]}>
                <AppointmentPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptions/appointment/:appointmentId"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["patient"]}>
                <PrescriptionPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doc-profile"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["doctor"]}>
                <DocProfilePage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doc-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["doctor"]}>
                <DocDashboardPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/history"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["doctor"]}>
                <HistoryPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/calendar"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["doctor"]}>
                <CalendarPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-history/:patientId"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["doctor"]}>
                <PatientHistory/>
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
