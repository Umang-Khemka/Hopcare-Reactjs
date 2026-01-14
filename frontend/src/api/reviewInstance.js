import axios from "axios";

const reviewInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:8000/api/v1/review"
            : "/api/v1/review",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
});

export default reviewInstance;