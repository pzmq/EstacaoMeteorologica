const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

const dbController = require('./controllers/dbController');
const mqttController = require('./controllers/mqttController');
const dataRoute = require('./routes/data');
const websocketController = require('./controllers/websocketController');
const infoRoute = require('./routes/info');

// Connect to the database
dbController.createPool();
// Connect to MQTT server
mqttController.connectToMQTT();
// Create HTTP server
const server = http.createServer(app);
// Start WebSocket server
websocketController.startWebSocketServer(server);


// Define routes
app.use('/data', dataRoute);
app.use('/info', infoRoute);
app.use('/', express.static(path.join(__dirname, 'routes/website')));

// Start the server
server.listen(8080, () => {
  console.log('Server running on port 8080');
});
