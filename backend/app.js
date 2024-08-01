const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: true }));
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const tenantRoutes = require('./routes/tenantRoutes');
app.use('/api/tenants', tenantRoutes);
const requestRoutes = require('./routes/requestRoutes');
app.use('/api/requests', requestRoutes);   
const paymentRoutes = require('./routes/paymentRoutes'); 
app.use('/api/payments', paymentRoutes);
// const announcementRoutes = require('./routes/announcementRoutes');
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);
// const resourceRoutes = require('./routes/resourceRoutes');

// const visitorRoutes = require('./routes/visitorRoutes');

// Middleware
app.use(express.json()); // For parsing application/json

// Routes

// app.use('/api/announcements', announcementRoutes);


// app.use('/api/resources', resourceRoutes);
// app.use('/api/visitors', visitorRoutes);

const PORT =  9000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
