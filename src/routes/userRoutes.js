const express = require('express');
const { check } = require('express-validator');
const { getUsers, getUser, updateUser, deleteUser, assignRoles } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize, hasPermission } = require('../middleware/roleAuth');

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin"), hasPermission("read:users"), getUsers);

router.get("/:id", authorize("admin"), hasPermission("read:user"), getUser);

router.put("/:id", authorize("admin"), hasPermission("update:user"), 

    [
        check('firstName', 'First name must not be empty if provided').optional().not().isEmpty(),
        check('lastName', 'Last name must not be empty if provided').optional().not().isEmpty(),
        check('email', 'Please include a valid email if provided').optional().isEmail(),
        check('phone', 'Phone must not be empty if provided').optional().not().isEmpty()
    ],

    updateUser
);

router.delete("/:id", authorize('admin'), hasPermission('delete:user'), deleteUser);

router.put("/:id/roles", authorize("admin"), hasPermission("assign:roles"), assignRoles);

module.exports = router;

