exports.authorize = (...roles) => {
    return (req, res, next) => {

        const userRoles = req.user.roles.map(role => role.name);

        const hasRole = roles.some(role => userRoles.includes(role));

        if(!hasRole) {
            return res.status(403).json({
                success: false,
                error: `User role ${userRoles} is not authorized to access this route`
            });
        }

        next();
    };
};

exports.hasPermission = (permission) => {
    return (req, res, next) => {
        
        const userPermissions = req.user.roles.reduce((perms, role) => {
            return [...perms, ...role.permissions];
        }, []);

        if(!userPermissions.includes(permission)) {
            return res.status(403).json({
                success: false,
                error: `User does not have permission to perform this action`
            });
        }

        next();
    };
};