const express = require('express');
const {getUserProfile, deleteUserProfile, updateUserProfile} = require('../controllers/profileController');

const router = express.Router();

router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.delete('/profile/:id', deleteUserProfile);

module.exports = router;