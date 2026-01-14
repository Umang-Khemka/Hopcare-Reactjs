import { create } from "zustand";
import doctorInstance from "../api/doctorInstance.js";

export const doctorStore = create((set) => ({
  appointments: [],
  loading: false,
  error: null,
  prescription: null,
  prescriptions: [],

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

  givePrescription: async ({ medicines, diagnosis, notes, appointmentId,followUp }) => {
    set({ loading: true, error: null });

    try {
      const res = await doctorInstance.post("/prescription", {
        appointmentId,
        medicines,
        diagnosis,
        notes,
        followUp,
      });
      set({ loading: false });
      set({ prescription: res.data.prescription });
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

  getAllPrescriptions: async () => {
    set({ loading: true, error: null });

    try {
      const res = await doctorInstance.get("/all-prescriptions");
      set({ prescriptions: res.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch prescriptions",
        loading: false,
      });
    }
  },

  updatePrescriptions: async ({
    medicines,
    diagnosis,
    notes,
    prescriptionId,
    followUp,
  }) => {
    set({ loading: true, error: null });
    console.log(followUp);
    try {
      const res = await doctorInstance.put(`/prescription/${prescriptionId}`, {
        medicines,
        diagnosis,
        notes,
        followUp,
      });

      set((state) => ({
        prescriptions: state.prescriptions.map((p) =>
          p._id === prescriptionId ? { ...p, ...res.data.prescription } : p
        ),
        loading: false,
      }));

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update prescription",
        loading: false,
      });
      return false;
    }
  },

  deletePrescriptions: async (prescriptionId) => {
    set({ loading: true, error: null });

    try {
      await doctorInstance.delete(`/prescription/${prescriptionId}`);
      set((state) => ({
        prescriptions: state.prescriptions.filter(
          (p) => p._id !== prescriptionId
        ),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete prescription",
        loading: false,
      });
      return false;
    }
  },

  rescheduleAppointments: async(appointmentId, date, time)=> {
    try{
      const res = await doctorInstance.put(`/reschedule/${appointmentId}`,{date,time});

      const updatedAppointment = res.data.appointment;

      set((state)=> ({
        appointments: state.appointments.map((appt)=> 
          appt._id === appointmentId ? updatedAppointment : appt
        ),
      }));

      return true;
    }
    catch(error){
       set({
        error: error.response?.data?.message || "Failed to reschedule",
        loading: false,
      });
      return false;
    }
  
  }
}));
