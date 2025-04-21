const express = require('express');
const router = express.Router();

// GET / route
router.get('/', (req, res) => {
    res.render('create');
});

module.exports = router;