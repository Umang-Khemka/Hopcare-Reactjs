import { create } from "zustand";
import authInstance from "../api/authInstance.js";
import patientInstance from "../api/patientInstance.js";
import doctorInstance from "../api/doctorInstance.js";

export const authStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  patientProfile: null,
  doctorProfile: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  register: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const res = await authInstance.post("/register", {
        name,
        email,
        password,
        role,
      });

      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        loading: false,
      });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Registration Failed",
        loading: false,
      });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authInstance.post("/login", { email, password });

      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        loading: false,
      });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await authInstance.post("/logout");
      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || "Logout failed" });
    }
  },

  checkAuth: async () => {
    try {
      const res = await authInstance.get("/check");
      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
  updatePatientProfile: async ({age,gender,weight,height})=> {
    set({loading: true, error: null});

    try{
      const res = await patientInstance.put("/update-profile",{
        age,
        gender,
        weight,
        height
      });
      set({loading: false});
      return res.data.profile;
    } catch(error){
      set({
        error: error.response?.data?.message || "Profile not Updated",
        loading: false,
      });
      throw error;
    }
  },
  getPatientProfile : async()=> {
    set({loading: true, error: null});
    try{
      const res = await patientInstance.get("/profile");
      set({loading: false, patientProfile: res.data.profile});
    } catch(error){
      set({
        error: error.response?.data?.message || "Profile not found",
        loading: false,
      });
      throw error;
    }
  },
  updateDoctorProfile: async({ licenseNumber, specialization, experience, fees })=> {
    set({loading: true, error: null});
    try{
      const res = await doctorInstance.put("/doc-profile",{
        licenseNumber,
        specialization,
        experience,
        fees,
      });
      set({loading: false});
      return res.data.profile;
    } catch(error){
      set({
        error: error.response?.data?.message || "Profile not Updated",
        loading: false,
      });
      throw error;
    }
  },
  getDoctorProfile : async()=> {
    set({loading: true, error: null});
    try{
      const res = await doctorInstance.get("/my-profile");
      set({loading: false, doctorProfile: res.data.profile});
    } catch(error){
      set({
        error: error.response?.data?.message || "Profile not found",
        loading: false,
      });
      throw error;
    }
  },
}));
