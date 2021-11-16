const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth') ;


const postPublicCtrl = require('../controllers/public-post') ;

router.get('/all-poster', auth.default ,postPublicCtrl.all_poster) ;
router.get('/current-comment-poste/:id', auth.userApp ,postPublicCtrl.current_comment_of_poster) ;
router.post('/comment-poster', auth.userApp ,postPublicCtrl.comment) ;
router.put('/loved-poster/:id', auth.userApp ,postPublicCtrl.lovedPoster);
router.get('/user-poster/:userId', auth.userApp ,postPublicCtrl.user_poster) ;
router.get('/members-poster/:userId', auth.userApp ,postPublicCtrl.members_poster) ;


module.exports = router;
