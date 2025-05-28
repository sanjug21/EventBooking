const Booking = require('../models/Booking');
const Event = require('../models/Events');
const mongoose = require('mongoose');

const bookTicket = async (req, res) => {
    const { eventId} = req.body;
    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const event = await Event.findById(eventId).session(session);
        if (!event) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.availableTickets <= 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'No tickets available for this event' });
        }

        const existingBooking = await Booking.findOne({ event: eventId, user: userId, status:'Confirmed' }).session(session);
        if (existingBooking) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'You have already booked a ticket for this event' });
        }

        const booking = new Booking({
            event: eventId,
            user: userId,
            status: 'Confirmed',
            bookingDate: new Date(),
        });
        await booking.save({ session });

        event.availableTickets -= 1;
        await event.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Ticket booked successfully', booking });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console
        return res.status(500).json({ message: 'Error booking ticket', error });
    }
}

const getBookings = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookings = await Booking.find({ user: userId }).populate('event').populate('user').sort({ bookingDate: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
}

const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const booking = await Booking.findOne({ _id: bookingId, user: userId }).session(session);
        if (!booking) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Booking not found' });
        }

        if(booking.user.toString() !== userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
        }

        if (booking.status === 'Cancelled') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Booking already cancelled' });
        }

        booking.status = 'Cancelled';
        await booking.save({ session });

        const event = await Event.findById(booking.event).session(session);
        if (event) {
            event.availableTickets += 1;
            await event.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: 'Error cancelling booking', error });
    }
}

module.exports = {bookTicket, getBookings, cancelBooking};