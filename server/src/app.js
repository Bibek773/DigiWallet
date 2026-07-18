const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/admin.routes");
const collegeRoutes=require("./routes/college.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "3mb" }));

app.use("/api/college", collegeRoutes);
app.use("/api/student", require("./routes/student.routes"));
app.use("/api/credentials", require("./routes/credential.routes"));
app.use("/api/verify", require("./routes/verify.routes"));
app.use("/api/admin", adminRoutes);
app.use("/api/auth", require("./routes/auth.routes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "DiGiWallet API is running" });
});

module.exports = app;
