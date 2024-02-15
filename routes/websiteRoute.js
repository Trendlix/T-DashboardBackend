const express = require('express');
const { addWebsite, deletedWebsite } = require('../controllers/websiteController');
const router = express.Router();

router.post('/website', addWebsite)
router.delete('/website/:websiteId', deletedWebsite)

module.exports = router;