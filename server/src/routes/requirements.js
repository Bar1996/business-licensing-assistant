const express = require('express');
const { getRequirements, matchRequirements } = require('../controllers/requirementsController');

const router = express.Router();

router.get('/', getRequirements);
router.post('/match', matchRequirements);

module.exports = router;
