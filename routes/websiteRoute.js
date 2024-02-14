const express = require('express');
const { addWebsite, deletedWebsite } = require('../controllers/websiteController');
const router = express.Router();

router.post('/website/:userId', addWebsite)
router.delete('/website/:websiteId', deletedWebsite)

module.exports = router;