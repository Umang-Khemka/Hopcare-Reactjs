import axios from "axios";

const patientInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:8000/api/v1/patient"
            : "/api/v1/patient",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
});

export default patientInstance;