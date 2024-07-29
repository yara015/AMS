const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
// app.use('/api/services', require('./routes/serviceRoutes'));
// app.use('/api/announcements', require('./routes/announcementRoutes'));
// app.use('/api/notifications', require('./routes/notificationRoutes'));
// app.use('/api/tenants', require('./routes/tenantRoutes'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
