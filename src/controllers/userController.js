const User = require('../models/User');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getUsers = async (req, res) => {
    
    try {

        const filter = {};

        if (req.query.firstName) {
            filter.firstName = { $regex: req.query.firstName, $options: 'i' };
        }
          
        if (req.query.lastName) {
            filter.lastName = { $regex: req.query.lastName, $options: 'i' };
        }
        
        if (req.query.email) {
            filter.email = { $regex: req.query.email, $options: 'i' };
        }
        
        if (req.query.phone) {
            filter.phone = { $regex: req.query.phone, $options: 'i' };
        }

        if(req.query.role) {

            const role = await mongoose.model("role").findOne({ name: req.query.role });
            if(role) {
                filter.roles = { $in: [role._id] };
            }
        }

        // Now i'm using pagination to display users
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const total = await User.countDocuments(filter);

        const users = await User.find(filter).populate("roles", "name").skip(startIndex).limit(limit);

        const formattedUsers = users.map(user => ({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            roles: user.roles.map(role => role.name),
            isActive: user.isActive,
            createdAt: user.createdAt
        }));

        res.status(200).json({
            success: true,
            count: users.length,
            pagination: {
                total, page, pages: Math.ceil(total / limit), limit
            },
            data: formattedUsers
        });
    } catch (err) {

        console.error(err);

        res.status(500).json({
        success: false,
        error: 'Server Error'
        });
    }
}

exports.getUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id).populate("roles", "name");

        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            }); 
        }

        res.status(200).json({
            success: true,
            data: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              roles: user.roles.map(role => role.name),
              isActive: user.isActive,
              createdAt: user.createdAt
            }
          });

    } catch (err) {

        console.error(err);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({
              success: false,
              error: 'User not found'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

exports.updateUser = async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    } 

    try {

        const {firstName, lastName, email, phone} = req.body;

        const updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (email) updateFields.email = email;
        if (phone) updateFields.phone = phone;

        if(email) {

            const emailExists = await user.findOne({email, _id: {$ne: req.params.id } });
            if(emailExists) {
                return res.status(400).json({
                    success: false,
                    error: "Email already in use"
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            updateFields, 
            {new: true, runValidators: true}).populate("roles", "name");

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              roles: user.roles.map(role => role.name),
              isActive: user.isActive,
              createdAt: user.createdAt
            }
        });

    } catch (err) {

        console.log(err);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({
              success: false,
              error: "User not found"
            });
        }
          
        res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (err) {

        console.error(err);
    
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
    
        res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

exports.assignRoles = async (req, res) => {

    try {

        const {roles} = req.body;

        if(!roles || !Array.isArray(roles) || roles.length === 0) {

            return res.status(400).json({
                success: false,
                error: "Please provide an array of role IDs"
            });
        } 

        const foundRoles = await mongoose.model("Role").find({
            _id: {$in: roles}
        });

        if(foundRoles.length !== roles.length) {

            return res.status(400).json({
                success: false,
                error: 'One or more roles not found'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {roles},
            {new: true}
        ).populate("roles", "name");

        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              roles: user.roles.map(role => role.name),
              isActive: user.isActive
            }
        });

    } catch(err) {

        console.log(err);

        if (err.kind === 'ObjectId') {
            
            return res.status(404).json({
              success: false,
              error: 'User or role not found'
            });
        }
          
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}