import { create } from "zustand";
import patientInstance from "../api/patientInstance.js";

export const patientStore = create((set) => ({
  loading: false,
  error: null,
  doctors: [],
  bookedSlots: [],
  totalCount: 0,
  Appointment: null,
  canceledAppointment: null,
  prescriptions: [],
  patient: null,
  appointments: [],


  getDoctors: async () => {
    set({ loading: true, error: null });
    try {
      const res = await patientInstance.get("/allDoctors");
      set({
        doctors: res.data.doctors,
        totalCount: res.data.count || 0,
        loading: false,
      });
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load doctors",
        loading: false,
      });
    }
  },

  bookingAppointment: async ({doctorId,date,time,symptoms}) => {
    set({ loading: true, error: null });
    try {
      const res = await patientInstance.post("/appointment", {
        doctorId,
        date,
        time,
        symptoms,
      });
      set({
        Appointment: res.data.slot,
        loading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to Book an Appointment",
        loading: false,
      });
    }
  },

  cancelingAppointment: async (appointmentId) => {
    set({ loading: true, error: null });

    try {
      const res = await patientInstance.put(`/${appointmentId}`, {
        status: "cancelled",
      });

      set({
        loading: false,
        success: true,
        canceledAppointment: res.data.appointment,
        message: res.data.message,
      });

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to cancel appointment",
      });

      throw error;
    }
  },

  allSlots: async ({doctorId, date}) => {
    set({ loading: true, error: null });
    try {
      const res = await patientInstance.get("/slots", {
        params: { doctorId, date },
      });

      set({ bookedSlots: res.data.bookedSlots, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch slots",
        loading: false,
      });
    }
  },
  patientHistory: async()=> {
    try{
      set({loading: true, error: null});
      const res = await patientInstance.get("/history");

      set({
        patient: res.data.patient,
        appointments: res.data.appointments,
        prescriptions: res.data.prescriptions,
        loading: false,
      });
    } catch(error){
      set({
        error: error.response?.data?.message || "Failed to fetch history",
        loading: false,
      });
    }
  }
}));
