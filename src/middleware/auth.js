const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

exports.protect = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return res.status(401).json({
            success: false,
            error: "Not authorized to access this route"
        });
    }

    try {

        const decoded = jwt.verify(token, config.jwtSecret);

        const user = await User.findById(decoded.id).populate("roles");

        if(!user || !user.isActive) {
            return res.json({
                success: false,
                error: "User no longer exists or is disabled"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
          });
    }
}