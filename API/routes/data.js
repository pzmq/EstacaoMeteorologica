const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/', (req, res) => {
  dbController.getAllData()
    .then((results) => res.json(results))
    .catch((error) => {
      console.error('Error querying data:', error);
      res.status(500).send('Error querying data');
    });
});

module.exports = router;
