import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import timerRoutes from "./routes/timerRoutes";
// import bodyParser from "body-parser";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json()); 
// app.use(bodyParser.urlencoded({extended:true}));
app.use("/api/auth",authRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/timer",timerRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(process.env.PORT, () =>
    console.log("Server running on port", process.env.PORT)
);