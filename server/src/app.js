const express = require('express');
const cors = require('cors');

const app = express();



// Middleware
app.use(cors());
app.use(express.json());

const adminRoutes= require("./routes/admin.routes")
app.use("/api/admin",adminRoutes)

// Routes — uncomment as each sprint implements them
// app.use('/api/auth',        require('./routes/auth.routes'));
// app.use('/api/admin',       require('./routes/admin.routes'));
// app.use('/api/credentials', require('./routes/credential.routes'));
// app.use('/api/student',     require('./routes/student.routes'));
// app.use('/api/verify',      require('./routes/verify.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'DiGiWallet API is running' });
});

module.exports = app;
