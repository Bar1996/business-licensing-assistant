require('dotenv').config();
const express = require('express');
const cors = require('cors');

const requirementsRoutes = require('./routes/requirements');
const reportRoutes = require('./routes/report');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/requirements', requirementsRoutes);
app.use('/report', reportRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
