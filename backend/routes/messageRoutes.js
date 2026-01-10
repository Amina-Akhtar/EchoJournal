const express = require('express');
const router = express.Router();
const { loadMessages } = require('../controllers/messageController');
const authenticate=require('../middleware/authenticate')

router.get('/', authenticate, loadMessages);
module.exports = router;