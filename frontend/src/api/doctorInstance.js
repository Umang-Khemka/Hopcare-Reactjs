import axios from "axios";

const doctorInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:8000/api/v1/doctor"
            : "/api/v1/doctor",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
});

export default doctorInstance;