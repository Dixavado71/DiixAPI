"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireOperator = exports.requireStoreManager = exports.requireStoreOwner = exports.requireSuperAdmin = exports.authorize = exports.authenticate = void 0;
const admin_auth_service_js_1 = require("../services/admin/admin-auth.service.js");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Access denied. No token provided.',
            });
        }
        const token = authHeader.split(' ')[1];
        const result = await admin_auth_service_js_1.adminAuthService.verifyToken(token);
        if (!result.valid) {
            return res.status(401).json({
                error: result.error || 'Invalid token',
            });
        }
        req.user = {
            userId: result.userId,
            email: result.email,
            role: result.role,
        };
        next();
    }
    catch (error) {
        return res.status(500).json({
            error: 'Internal server error during authentication',
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required',
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                requiredRoles: allowedRoles,
                yourRole: req.user.role,
            });
        }
        next();
    };
};
exports.authorize = authorize;
exports.requireSuperAdmin = (0, exports.authorize)('SUPER_ADMIN');
exports.requireStoreOwner = (0, exports.authorize)('STORE_OWNER', 'SUPER_ADMIN');
exports.requireStoreManager = (0, exports.authorize)('STORE_MANAGER', 'STORE_OWNER', 'SUPER_ADMIN');
exports.requireOperator = (0, exports.authorize)('OPERATOR', 'STORE_MANAGER', 'STORE_OWNER', 'SUPER_ADMIN');
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const result = await admin_auth_service_js_1.adminAuthService.verifyToken(token);
            if (result.valid) {
                req.user = {
                    userId: result.userId,
                    email: result.email,
                    role: result.role,
                };
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map