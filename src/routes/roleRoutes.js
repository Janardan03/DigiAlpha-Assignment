const express = require('express');
const { check } = require('express-validator');
const { createRole, getRoles } = require('../controllers/roleController');
const { protect } = require('../middleware/auth');
const { authorize, hasPermission } = require('../middleware/roleAuth');

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.post("/", hasPermission("create:role"), 
    [
        check("name", "Role name is required").not().isEmpty(),
        check("permissions", "Permissions must be an array").isArray()  
    ],
    createRole    
);

router.get("/", hasPermission("read:roles"), getRoles);

module.exports = router;

