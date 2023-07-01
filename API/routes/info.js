const express = require('express');
const router = express.Router();
const config = require('../config/config');

// Define the '/info' endpoint
router.get('/', (req, res) => {
  const mqttServer = config.MQTT_SERVER;
  const mqttPort = config.MQTT_PORT;
  const databaseHost = config.DB_HOST;
  const databasePort = config.DB_PORT;

  const response = {
    mqttServer,
    mqttPort,
    databaseHost,
    databasePort,
  };
  res.json(response);
});

module.exports = router;
