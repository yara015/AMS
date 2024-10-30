const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const cors=require('cors');
// Connect Database
connectDB();


app.use(express.json()); // For parsing application/json
app.use(cors());
// app.use(cors({origin:"http://localhost:5173",credentials:true}))


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
const announcementRoutes = require('./routes/announcementRoutes');
app.use('/api/announcements', announcementRoutes);
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);
const flatRoutes = require('./routes/flatRoutes');
app.use('/api/flats', flatRoutes);
const resourceRoutes = require('./routes/resourceRoutes');
app.use('/api/resources', resourceRoutes);
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);
const visitorRoutes=require('./routes/visitorRoutes')
app.use('/api/visitors', visitorRoutes);
const feedbackRoutes=require('./routes/feedbackRoutes');
app.use('/api/feedbacks',feedbackRoutes);
// Middleware


const cron = require('node-cron');

const { markAsCompleted } = require('./controllers/announcementController');
cron.schedule('0 0 * * *', async () => {
    try {
      await markAsCompleted();
    } catch (error) {
      console.error('Error while marking announcements as completed:', error);
    }
  });

const PORT =  9000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
