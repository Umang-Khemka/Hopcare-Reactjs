import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import {connectDB} from "./lib/db.js";
import userRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const __dirname = path.resolve();


dotenv.config();
const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/patient",patientRoutes);
app.use("/api/v1/doctor",doctorRoutes);
app.use("/api/v1/review",reviewRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
  connectDB();
});