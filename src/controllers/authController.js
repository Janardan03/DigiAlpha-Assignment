const User = require("..models/User");
const { validationResult } = require("express-validator");

exports.register = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({errors: errors.array() });
    }

    try {

        const { firstName, lastName, email, phone, password } = req.body;

        const userExists = await User.findOne({ email });

        if(userExists) {
            return res.status(400).json({
                success: false,
                error: "Email already registered"
            });
        }

        const user = await User.create({
            firstName, lastName, email, phone, password
        });

        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        })

    } catch (err) {

        console.error(err);
        res.status(500).json({
        success: false,
        error: "Server Error"
        });
    }
}

exports.login = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({errors: errors.array() });
    }

    try {

        const {email, password} = req.body;

        const user = await User.findOne({ email }).select("+password").populate("roles");

        if(!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid Credentials"
            });
        }

        if(!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Your account has been disabled'
              });
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
              });
        }

        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              roles: user.roles.map(role => role.name)
            }
          });

    } catch {
        
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}