const {verifyToken}= require('../utils/jwt');


const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[0];
    

    if (!token) {
        return res.status(401).json({ message: 'Token expired or not available' });
    }
    try{
    
        const decoded =await verifyToken(token);
   
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user=decoded;
    console.log(decoded);
    
    next();
    }catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}


const authorizeRoles=(roles)=> {
    
    
    return (req, res, next) => {
        console.log(req.user);
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        console.log('User authorized:', req.user);
        next();
    };
}

module.exports ={ authenticateToken, authorizeRoles };