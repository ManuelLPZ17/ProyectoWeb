const express = require('express');
const routerAuth = express.Router();
const authController = require('../controllers/auth_controller');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/auth/login
routerAuth.post('/login', authController.loginUser);

// GET /api/auth/me
routerAuth.get('/me', authMiddleware.authRequiredMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = routerAuth;
