const jwt= require('jsonwebtoken');

const jwtSecret ="your_jwt_secret";

const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }, jwtSecret, {
        expiresIn: '1h'
    });
}
const verifyToken = async(token) => {
    try {
        const decoded = await jwt.decode(token);
        return decoded
    } catch (error) {
        return null;
    }
}   

module.exports = {generateToken, verifyToken};