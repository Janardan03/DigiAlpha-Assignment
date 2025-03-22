const Role = require('../models/Role');
const { validationResult } = require('express-validator');

exports.createRole = async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name, permissions, description } = req.body;

        const roleExists = await Role.findOne({name});

        if(roleExists) {
            return res.status(400).json({
                success: false,
                error: 'Role already exists'
            });
        }

        const role = await Role.create({
            name, permissions, description
        });

        res.status(201).json({
            success: true,
            data: role
        });

    } catch (err) {

        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

exports.getRoles = async (req, res) => {

    try {

        const roles = await Role.find();

        res.status(200).json({
            success: true,
            count: roles.length,
            data: roles
        });

    } catch (err) {

        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}