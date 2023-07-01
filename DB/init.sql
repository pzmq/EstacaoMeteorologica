CREATE DATABASE IF NOT EXISTS weather;

USE weather;

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Temperatura FLOAT,
  Humidade FLOAT,
  Luminosidade FLOAT,
  Status VARCHAR(255),
  LedStatus boolean,
  Localizacao VARCHAR(255),
  Tempo DATETIME DEFAULT CURRENT_TIMESTAMP
);
