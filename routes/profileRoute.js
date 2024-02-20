const express = require('express');
const {getUserProfile, deleteUserProfile, updateUserProfile} = require('../controllers/profileController');
const { accessUser } = require('../middlewares/middleware');

const router = express.Router();

router.get('/profile', accessUser, getUserProfile);
router.put('/profile', accessUser, updateUserProfile);
router.delete('/profile', accessUser, deleteUserProfile);

module.exports = router;