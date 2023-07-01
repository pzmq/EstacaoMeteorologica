const mqtt = require('mqtt');

function generateMockData(mqttServer, mqttPort, mqttUsername, mqttPassword, mqttTopic) {
  // Create a MQTT client
  const mqttClient = mqtt.connect({
    hostname: mqttServer,
    port: mqttPort,
    username: mqttUsername,
    password: mqttPassword,
  });

  // Generate mock data for Tomar
  const data = [
    { Localizacao: 'tomar', Temperatura: 25.5, Humidade: 60.2, Luminosidade: 80.7, Status: 'dia', LedStatus: 0 },
    // Add more data points here
  ];


  // Generate 20 additional data points
  for (let i = 1; i <= 5; i++) {
    // Calculate fluctuation based on sine function
    const amplitude = 5; // Set the amplitude of the oscillation
    const frequency = 0.1; // Set the frequency of the oscillation
    const offset = i * 0.1; // Set an offset to vary the starting point of the oscillation
    const temperaturaFluctuation = Math.round(Math.sin(offset + frequency * i) * amplitude);
    const humidadeFluctuation = Math.round(Math.cos(offset + frequency * i) * amplitude);
  
    // Apply the fluctuation to the previous values
    const previousDataPoint = data[data.length - 1];
    const temperatura = previousDataPoint.Temperatura + temperaturaFluctuation;
    const humidade = previousDataPoint.Humidade + humidadeFluctuation;
  
    // Create the new data point
    const newDataPoint = {
      Localizacao: 'coimbra',
      Temperatura: temperatura,
      Humidade: humidade,
      Luminosidade: 80.7, // Use a fixed value for Luminosidade
      Status: 'dia', // Use a fixed value for Status
      LedStatus: 0, // Use a fixed value for LedStatus
    };
  
    // Add the new data point to the array
    data.push(newDataPoint);
  }
  // Generate timestamp for each data point
  const currentTime = new Date().getTime();
  data.forEach((entry, index) => {
    const timestamp = new Date(currentTime + index * 1000); // Calculate the timestamp for each entry
    entry.Tempo = timestamp.toISOString().slice(0, 19); // Format the timestamp to the DATETIME format 'YYYY-MM-DD HH:mm:ss'
  });


  // Connect to MQTT server
  mqttClient.on('connect', () => {
    console.log('Connected to MQTT server');

    // Publish each data point
    data.forEach((dataPoint) => {
      // Convert data point to JSON string
      const message = JSON.stringify([dataPoint]);

      // Publish message
      mqttClient.publish(mqttTopic, message);

      // Log the published message
      console.log('Published message:', message);
    });

    // Disconnect from MQTT server
    mqttClient.end();
  });

  // Handle MQTT connection errors
  mqttClient.on('error', (error) => {
    console.error('MQTT connection error:', error);
  });
}

// Configuration
const MQTT_SERVER = '0.tcp.eu.ngrok.io';
const MQTT_PORT = 10440;
const MQTT_USERNAME = 'user1';
const MQTT_PASSWORD = 'user1';
const MQTT_TOPIC = 'data';

// Generate mock data
generateMockData(MQTT_SERVER, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD, MQTT_TOPIC);
