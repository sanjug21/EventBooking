const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventsRoutes = require('./routes/events');
const bookingsRoutes = require('./routes/bookings');    
const userRoutes = require('./routes/user');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/events').then(()=>{
    console.log('Database ban gaya');
}).catch((err)=>{
    console.log('Error aa gaya database me:', err);
});

app.use('/api/users', userRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/bookings', bookingsRoutes);




app.get('/',(req, res) => {
    res.send("API's chal rahi hai");
});




app.listen(3000,()=>{
    console.log('Server chal gaya');
});