const express = require('express');
const router = express.Router();
const { signup, signin, signout, googleAuth } = require('../controllers/userController');
const authenticate=require('../middleware/authenticate')

router.post('/signup', signup);
router.post('/signin',signin);
router.post('/signout',authenticate,signout);
router.post('/google',googleAuth)
module.exports = router;