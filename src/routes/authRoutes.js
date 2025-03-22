const express = require("express");
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post("/register", 
    [
        check("firstName", "First name is required").not().isEmpty(),
        check("lastName", "Last name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("phone", "Phone number is required").not().isEmpty(),
        check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })
    ],
    register
);

router.post("/login", 
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists()
    ],
    login
);

module.exports = router;