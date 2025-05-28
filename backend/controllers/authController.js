const User = require('../models/User');

const { generateToken } = require('../utils/jwt');

const SignUp = async (req, res) => {
    const { name, email, password,role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ name, email, password,role });
        await newUser.save();
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }catch(error) {
        console.error("Signup error:", error); 
        return res.status(500).json({ message: 'Unable to register' });
    }
}

const SignIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = generateToken(user);
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            },token});
    }catch (error) {
        return res.status(500).json({ message: 'Unable to login' });
    }

}

module.exports = {SignUp, SignIn};