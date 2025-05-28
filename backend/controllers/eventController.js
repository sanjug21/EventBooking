const Event = require('../models/Events');
const Booking = require('../models/Booking');

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not exist' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Server error or invalid ID.'});
    }
}

const createEvent = async (req, res) => {
    const {title, description, date, location, totalSeats} = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            totalSeats
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Failed to create event' });
    }
   
}   

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, location, totalSeats } = req.body;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
       const avilableSeats = event.availableSeats + (totalSeats - event.totalSeats);
        if (avilableSeats < 0) {
            return res.status(400).json({ message: 'Total seats cannot be less than available seats' });
        }
        event.title = title;
        event.description = description;
        event.date = date;
        event.location = location;
        event.totalSeats = totalSeats;
        event.availableSeats = newAvailableSeats;

        await event.save();
        res.status(200).json(event);
        
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Unable to update event' });
    }
}

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
    const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const bookingCount = await Booking.countDocuments({ Event: id , status: 'Confirmed' });
        if (bookingCount > 0) {
            return res.status(400).json({ message: 'Cannot delete event with confirmed bookings' });
        }
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: 'Event deleted successfully' });
   
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Failed to delete event' });
    }
}

module.exports = {getAllEvents, getEventById, createEvent, updateEvent, deleteEvent};

