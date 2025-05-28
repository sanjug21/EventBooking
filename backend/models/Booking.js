const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: [ 'Confirmed', 'Cancelled'],
        default: 'Confirmed'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },

},{timestamps: true});