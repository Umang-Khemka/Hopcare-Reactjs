import { create } from "zustand";
import doctorInstance from "../api/doctorInstance.js";

export const doctorStore = create((set) => ({
  appointments: [],
  loading: false,
  error: null,
  prescription: null,

  getAllAppointments: async () => {
    set({ loading: true, errro: null });
    try {
      const res = await doctorInstance.get("/all-appointments");
      set({ appointments: res.data.appointments, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Registration Failed",
        loading: false,
      });
      return false;
    }
  },

  changeAppointmentStatus: async ({ appointmentId, status }) => {
    set({ loading: true, error: null });
    try {
      const res = await doctorInstance.put(`/change-status/${appointmentId}`, {
        status,
      });
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a._id === appointmentId ? { ...a, status: "completed" } : a
        ),
        loading: false,
      }));

      return true;
    } catch (error) {
      console.error("Error changing appointment status:", error);
      set({
        loading: false,
        error: error.response?.data?.message || error.message,
      });
      throw error;
    }
  },

  givePrescription: async ({ medicines, diagnosis, notes, appointmentId }) => {
    set({ loading: true, error: null });

    try {
      const res = await doctorInstance.post("/prescription", {
        appointmentId,
        medicines,
        diagnosis,
        notes,
      });
      set({loading: false});
      set({prescription: res.data.prescription});
      return true;
    } catch (error) {
        console.error("Create prescription error:", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Something went wrong",
      });

      throw error;
    }
  },
}));
