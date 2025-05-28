const joi= require('joi');

const UserRegistration= joi.object({
    name: joi.string().min(1).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(20).required(),
    role: joi.string().valid('user', 'admin').default('user').optional(),
    
});

const UserLogin= joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(20).required(),
});

const EventCreation= joi.object({
    title: joi.string().min(1).max(100).required(),
    description: joi.string().min(1).max(500).required(),
    date: joi.date().required(),
    location: joi.string().min(1).max(100).required(),
    totalSeats: joi.number().integer().min(1).required(),
});

const BookingCreation= joi.object({
    userId: joi.string().required(),
    eventId: joi.string().required(),
    status: joi.string().valid('Confirmed', 'Cancelled').default('Confirmed'),
});

const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            console.log("Validation error:", error.details[0].message);
            return res.status(400).json({ message: "Validation failed" });
        }
        next();
    };
}


module.exports = {UserRegistration, UserLogin, EventCreation, BookingCreation, validationMiddleware };