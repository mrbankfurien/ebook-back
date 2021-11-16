const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth') ;

router.use(auth.userApp);

const posterCtrl = require('../controllers/poster');


router.get('/all-post/:userId', posterCtrl.all);
router.post('/save-post', posterCtrl.create);
router.get('/getOnPost/:id',posterCtrl.getOnPost);
router.put('/update-post/:id', posterCtrl.update);
router.delete('/deleted/:id' , posterCtrl.deleted);

module.exports = router;