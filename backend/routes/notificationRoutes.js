const express = require('express');
const router = express.Router();
const { getNotifications, updateNotification } = require('../controllers/notificationController');
const authenticate=require('../middleware/authenticate');

router.get('/:username', authenticate, getNotifications);
router.patch('/:notificationId',authenticate, updateNotification)
module.exports = router;