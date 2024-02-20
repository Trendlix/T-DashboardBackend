const express = require('express');
const { addWebsite, deletedWebsite } = require('../controllers/websiteController');
const { accessUser } = require("../middlewares/middleware")
const router = express.Router();

router.post('/website', accessUser , addWebsite)
router.delete('/website', deletedWebsite)

module.exports = router;