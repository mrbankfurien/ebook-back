const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth') ;

const userCtrl = require('../controllers/user');

//router.get('/data/:token', auth.userApp ,userCtrl.dataUser);
router.put('/update-password/:token', auth.userApp ,userCtrl.updatePassword);
router.post('/signup',auth.default, userCtrl.signup);
router.post('/login',auth.default, userCtrl.login);
router.post('/reset-password',auth.default, userCtrl.reset);
router.post('/update-data',auth.userApp ,userCtrl.updateData);

module.exports = router;