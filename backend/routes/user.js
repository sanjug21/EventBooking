const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { UserRegistration,UserLogin,validationMiddleware} = require('../middleware/validation');

router.post('/register', validationMiddleware(UserRegistration), authController.SignUp);
router.post('/login', validationMiddleware(UserLogin), authController.SignIn);

module.exports = router;