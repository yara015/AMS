const mongoose = require('mongoose');
const db = "mongodb+srv://ams_admin:Ams%40admin01@amsdb.bbaktw7.mongodb.net/AMSdb";

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;