require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectMongoDB = require("../database/mongodb/setup");

const patientRouter = require("./routes/patientRoutes");
const staffRouter = require("./routes/staffRoutes");
const departmentRouter = require("./routes/departmentRoutes");
const treatmentRouter = require("./routes/treatmentRoutes");
const scheduleRouter = require("./routes/scheduleRoutes");
const jobHistoryRouter = require("./routes/jobHistoryRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");

const app = express();
const port = 4000;
connectMongoDB();

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(bodyParser.text({ limit: "200mb" }));

// Route setup
app.use("/patient", patientRouter);
app.use("/staff", staffRouter);
app.use("/department", departmentRouter);
app.use("/treatment", treatmentRouter);
app.use("/schedule", scheduleRouter);
app.use("/job-history", jobHistoryRouter);
app.use("/appointment", appointmentRouter);

// Health check route
app.get("/", (req, res) => {
	res.json({ message: "The server is running!" });
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}/`);
});
