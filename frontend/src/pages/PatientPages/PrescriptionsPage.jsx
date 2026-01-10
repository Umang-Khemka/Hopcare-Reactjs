import React from "react";
import { patientStore } from "../../store/patient.store.js";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function PrescriptionsPage() {
  const { prescriptionById, prescription, loading, error } = patientStore();
  const { appointmentId } = useParams();

  useEffect(() => {
    if (appointmentId) {
      console.log("=== FRONTEND: Fetching prescription for appointment ===");
      console.log("Appointment ID:", appointmentId);
      
      prescriptionById(appointmentId).then((data) => {
        console.log("=== FRONTEND: Prescription fetched successfully ===");
        console.log("Prescription data:", data);
      }).catch((err) => {
        console.error("=== FRONTEND: Error fetching prescription ===");
        console.error("Error:", err);
      });
    }
  }, [appointmentId]);

  // Add this to see the state updates in real-time
  useEffect(() => {
    console.log("=== FRONTEND: State updated ===");
    console.log("Loading:", loading);
    console.log("Error:", error);
    console.log("Prescription:", prescription);
  }, [loading, error, prescription]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading prescription...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">No prescription found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prescription Details</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(prescription, null, 2)}
      </pre>
    </div>
  );
}