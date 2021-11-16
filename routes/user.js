const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth') ;

router.use(auth.default);

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/reset-password', userCtrl.reset);

module.exports = router;