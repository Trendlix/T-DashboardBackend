const express = require('express');
const { addWebsite, deletedWebsite, getWebsites } = require('../controllers/websiteController');
const { accessUser, checkAdmin } = require("../middlewares/middleware")
const router = express.Router();

router.get('/website', checkAdmin, getWebsites)
router.post('/website', checkAdmin , addWebsite)
router.delete('/website/:websiteId', checkAdmin, deletedWebsite)

module.exports = router;