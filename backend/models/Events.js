const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    },
    availableSeats: {
        type: Number,
        required: true,
        default: function() {
            return this.totalSeats;
        },
        min: 0
    },
}, {
    timestamps: true
})

const Event = mongoose.model('Event', eventsSchema);
module.exports = Event;