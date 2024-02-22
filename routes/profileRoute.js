const express = require('express');
const {getUserProfile, updateUserProfile} = require('../controllers/profileController');
const { accessUser } = require('../middlewares/middleware');

const router = express.Router();

router.get('/profile', accessUser, getUserProfile);
router.put('/profile', accessUser, updateUserProfile);

module.exports = router;