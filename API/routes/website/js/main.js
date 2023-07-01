const localizacoesUnicas = [];
let sendLedCommand;
let ledstatus = 0;
let cardCounter = 5; // Counter variable for generating unique IDs

function connectToWebSocket() {
  function sendLocation() {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    const locationData = { Localizacao: location };
    const jsonData = JSON.stringify(locationData);
    websocket.send(jsonData);
  }

  const websocket = new WebSocket('wss://e2ef-194-210-241-15.ngrok-free.app');

  websocket.onopen = function() {
    console.log('Conexão WebSocket aberta');
    const path = window.location.pathname;
  
    if (path === '/estatisticas.html') {
      const urlParams = new URLSearchParams(window.location.search);
      const locationParam = urlParams.get('location');
  
      if (locationParam) {
        sendLocation(locationParam);
        console.log('Enviando localização:', locationParam);
      }
    } else if (path === '/') {
      getAllLocations();
      console.log('Recebendo localizações únicas:', localizacoesUnicas);
    }
  };

  function getAllLocations() {
    const message = { list: 'all' };
    websocket.send(JSON.stringify(message));
  }
  
  websocket.onmessage = function(event) {
  const message = event.data;
  console.log(message);

  if (window.location.pathname === '/estatisticas.html') {
    //console.log('Pagina estatisticas recebeu a msg :', message);
    console.log('Pagina estatisticas recebeu a msg ');
    try {
      const records = JSON.parse(message);

      records.forEach(data => {
        const { Temperatura, Humidade, Tempo, Localizacao, Luminosidade, Status, LedStatus } = data;
        //addSidebarItem(Localizacao);
        receiveUpdatedChartData(Temperatura, Humidade, Luminosidade, Tempo);
        cardMeteorologia(Temperatura, Humidade, Tempo, Localizacao, Luminosidade, Status);
        ledstatus = LedStatus;
        estadoLed(ledstatus);
      });
    } catch (error) {
      console.error('Erro ao analisar a mensagem JSON:', error);
    }
  } else if (window.location.pathname === '/'){
    try {
      const records = JSON.parse(message);

      records.forEach(data => {
        const { Temperatura, Humidade, Tempo, Localizacao, Luminosidade, Status, LedStatus } = data;

        addSidebarItem(Localizacao);
        addCardMeteorologia(Temperatura, Humidade, Tempo, Localizacao, Luminosidade, Status);
      });
    } catch (error) {
      console.error('Erro ao analisar a mensagem JSON:', error);
    }
  } else {
    // Redirect to the root URL
    window.location.href = '/';
  }
};

if (window.location.pathname === '/estatisticas.html') {
  const temperatureChart = initializeChart('temperatureChart', 'Temperature', [], {});
  const humidityChart = initializeChart('humidityChart', 'Humidity', [], {});
  const luminosityChart = initializeChartLum('luminosityChart', 'Luminosity', [], {});

  function receiveUpdatedChartData(Temperature, Humidity, Luminosity, tempo) {
    console.log('Recebendo dados atualizados:', Temperature, Humidity, tempo);
    updateChart(temperatureChart, tempo, [Temperature]);
    updateChart(humidityChart, tempo, [Humidity]);
    updateChartLum(luminosityChart, tempo, [Luminosity]);
  }
}
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function cardMeteorologia(temperatura, humidade, tempo, localizacao, luminosidade, status) {
    console.log('Card:', temperatura, humidade, tempo, localizacao, luminosidade);
    document.getElementById('location1').textContent = localizacao;
    const data = new Date(tempo);
    document.getElementById('date1').textContent = formatDate(data);
    document.getElementById('temp-tomar').textContent = `${temperatura}° C`;
    document.getElementById('humidity1').textContent = `${humidade}%`;
    document.getElementById('luminusidade1').textContent = `${luminosidade}l`;
    document.getElementById('status1').textContent = status;
    estadoDia(status, localizacao);
  }

  sendLedCommand = function(command) {
    const ledCommand = { led: command };
    const jsonData = JSON.stringify(ledCommand);
    console.log(jsonData);
    websocket.send(jsonData);
  };

  function estadoLed(ledstatus){
  if (ledstatus == 1) {
    $("#luz").removeClass("bg-dark").addClass("bg-success");
    $('#luzContent').html('<img src="./img/light-bulb-On.svg" /><br/><span>Luz</span>');
  } else if (ledstatus == 0) {
    $("#luz").removeClass("bg-success").addClass("bg-dark");
    $('#luzContent').html('<img src="./img/light-bulb-Off.svg" /><br/><span>Sem Luz</span>');
  }
}

function addSidebarItem(location) {
  const sidebar = document.getElementById('accordionSidebar');

  // Check if the location item already exists in the sidebar
  const existingItem = sidebar.querySelector(`a[data-location="${location}"]`);
  if (existingItem) {
    return; // Item already exists, no need to add it again
  }

  // Create the new item
  const newItem = document.createElement('li');
  newItem.classList.add('nav-item');

  const link = document.createElement('a');
  link.classList.add('nav-link');
  link.href = `estatisticas.html?location=${location}`;
  link.setAttribute('data-location', location);

  const icon = document.createElement('i');
  icon.classList.add('fas', 'fa-fw', 'fa-cloud');

  const text = document.createTextNode(location);

  // Build the item hierarchy
  link.appendChild(icon);
  link.appendChild(text);
  newItem.appendChild(link);

  // Append the new item to the sidebar
  sidebar.appendChild(newItem);
}
}

function addSidebarItem(location) {
  const sidebar = document.getElementById('accordionSidebar');

  // Check if the location item already exists in the sidebar
  const existingItem = sidebar.querySelector(`a[data-location="${location}"]`);
  if (existingItem) {
    return; // Item already exists, no need to add it again
  }

  // Create the new item
  const newItem = document.createElement('li');
  newItem.classList.add('nav-item');

  const link = document.createElement('a');
  link.classList.add('nav-link');
  link.href = `estatisticas.html?location=${location}`;
  link.setAttribute('data-location', location);

  const icon = document.createElement('i');
  icon.classList.add('fas', 'fa-fw', 'fa-cloud');

  const span = document.createElement('span');
  span.textContent = location;

  // Build the item hierarchy
  link.appendChild(icon);
  link.appendChild(span);
  newItem.appendChild(link);

  // Append the new item to the sidebar
  sidebar.appendChild(newItem);
}


function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString(undefined, options);
}

function createCardElement(localizacao, tempo, status) {
  const card = document.createElement('div');
  const container = document.createElement('div');
  const cardHeader = document.createElement('div');
  const locationElement = document.createElement('span');
  const dateElement = document.createElement('span');
  const temperatureElement = document.createElement('span');
  const statusElement = document.createElement('div');
  const flexContainer = document.createElement('div');
  const humidityElement = document.createElement('div');
  const luminosityElement = document.createElement('div');

  card.className = `card-meteorologia-${status.toLowerCase()}`;
  card.setAttribute('onclick', `window.location.href='estatisticas.html?location=${localizacao}'`);
  container.className = 'container';
  container.id = `container-${localizacao.toLowerCase()}`;
  cardHeader.className = `card-meteorologia-header-${status.toLowerCase()}`;
  locationElement.id = `location-${localizacao}`;
  dateElement.id = `date-${localizacao}`;
  temperatureElement.className = `temp-${status.toLowerCase()}`;
  statusElement.className = status.toLowerCase();
  flexContainer.className = 'flex-grow-1';
  humidityElement.className = 'humidity';
  luminosityElement.className = 'luminosity';

  locationElement.textContent = localizacao;
  dateElement.textContent = formatDate(new Date(tempo));

  if (status === 'Dia') {
    container.innerHTML = `
      <div class="cloud front">
        <span class="left-front"></span>
        <span class="right-front"></span>
      </div>
      <span class="sun sunshine"></span>
      <span class="sun"></span>
      <div class="cloud back">
        <span class="left-back"></span>
        <span class="right-back"></span>
      </div>
    `;
  } else if (status === 'Noite') {
    container.innerHTML = `
      <div class="stars left"><i class="fas fa-fw fa-star"></i></div>
      <div class="stars front"><i class="fas fa-fw fa-star"></i></div>
      <span class="moon"></span>
      <div class="stars back"><i class="fas fa-fw fa-star"></i></div>
    `;
  }

  cardHeader.appendChild(locationElement);
  cardHeader.appendChild(dateElement);
  card.appendChild(container);
  card.appendChild(cardHeader);
  card.appendChild(temperatureElement);
  card.appendChild(statusElement);
  card.appendChild(flexContainer);
  flexContainer.appendChild(humidityElement);
  flexContainer.appendChild(luminosityElement);

  return card;
}


function createTemperatureElement(temperatura) {
  const temperatureElement = document.createElement('span');
  temperatureElement.className = 'temp-noite';
  temperatureElement.textContent = `${temperatura}° C`;
  return temperatureElement;
}

function createHumidityElement(humidade) {
  const humidityElement = document.createElement('p');
  humidityElement.className = 'humidity-noite';
  humidityElement.textContent = `${humidade}%`;
  return humidityElement;
}

function createLuminosityElement(luminosidade) {
  const luminosityElement = document.createElement('p');
  luminosityElement.className = 'luminosity-noite';
  luminosityElement.textContent = `${luminosidade}l`;
  return luminosityElement;
}

// Função para criar o elemento de status
function createStatusElement(status) {
  const statusElement = document.createElement('div');
  statusElement.className = status.toLowerCase();
  statusElement.textContent = status;
  return statusElement;
}


function addCardMeteorologia(temperatura, humidade, tempo, localizacao, luminosidade, status) {
  const cardContainer = document.getElementById('card-container');

  const existingCard = document.querySelector(`.card-meteorologia-${status.toLowerCase()}[data-location="${localizacao}"]`);

  if (existingCard) {
    const temperatureElement = existingCard.querySelector('.temperature');
    const humidityElement = existingCard.querySelector('.humidity');
    const luminosityElement = existingCard.querySelector('.luminosity');

    temperatureElement.textContent = `${temperatura}° C`;
    humidityElement.textContent = `${humidade}%`;
    luminosityElement.textContent = `${luminosidade}l`;

    // Verificar se o status mudou e chamar a função estadoDia se necessário
    const currentStatus = existingCard.getAttribute('data-status');
    if (currentStatus !== status) {
      estadoDia(status, localizacao);
    }
  } else {
    const card = createCardElement(localizacao, tempo, status);
    const temperatureElement = createTemperatureElement(temperatura);
    const humidityElement = createHumidityElement(humidade);
    const luminosityElement = createLuminosityElement(luminosidade);
    const statusElement = createStatusElement(status); // Adicionado elemento de status

    card.appendChild(temperatureElement);
    card.appendChild(humidityElement);
    card.appendChild(luminosityElement);
    card.appendChild(statusElement); // Adicionado elemento de status ao cartão

    cardContainer.appendChild(card);

    // Chamar a função estadoDia para definir a aparência correta do cartão
    estadoDia(status, localizacao);
  }
}




function luz(sendLedCommand) {
  function sendLedOnCommand() {
    sendLedCommand('on');
  }

  function sendLedOffCommand() {
    sendLedCommand('off');
  }

  if (ledstatus == 1) {
    console.log("Estado do led:", ledstatus);
    $("#luz").removeClass("bg-dark").addClass("bg-success");
    $('#luzContent').html('<img src="./img/light-bulb-On.svg" /><br/><span>Luz</span>');
    sendLedOffCommand();
  } else if (ledstatus == 0) {
    console.log("Estado do led:", ledstatus);
    $("#luz").removeClass("bg-success").addClass("bg-dark");
    $('#luzContent').html('<img src="./img/light-bulb-Off.svg" /><br/><span>Sem Luz</span>');
    sendLedOnCommand();
  }
}

// Atualiza as cards da meteorologia para noite ou dia
function estadoDia(status, localizacao) {
  localizacao = localizacao.toLowerCase();
  console.log("Estado do tempo:", localizacao);
  const cardHeaderElement = document.getElementById(`card-meteorologia-header-${localizacao}`);
  const temperatureElement = document.getElementById(`temp-${localizacao}`);
  const cardElement = document.getElementById(`card-meteorologia-${localizacao}`);
  const containerElement = document.getElementById(`container-${localizacao}`);

  if (cardHeaderElement) {
    if (status === "Dia") {
      cardHeaderElement.classList.remove("card-meteorologia-header-noite");
      cardHeaderElement.classList.add("card-meteorologia-header-dia");
    } else if (status === "Noite") {
      cardHeaderElement.classList.remove("card-meteorologia-header-dia");
      cardHeaderElement.classList.add("card-meteorologia-header-noite");
    }
  }

  if (temperatureElement) {
    if (status === "Dia") {
      temperatureElement.classList.remove("temp-noite");
      temperatureElement.classList.add("temp-dia");
    } else if (status === "Noite") {
      temperatureElement.classList.remove("temp-dia");
      temperatureElement.classList.add("temp-noite");
    }
  }

  if (cardElement) {
    if (status === "Dia") {
      cardElement.classList.remove("card-meteorologia-noite");
      cardElement.classList.add("card-meteorologia-dia");
      containerElement.innerHTML = `
        <div class="cloud front">
          <span class="left-front"></span>
          <span class="right-front"></span>
        </div>
        <span class="sun sunshine"></span>
        <span class="sun"></span>
        <div class="cloud back">
          <span class="left-back"></span>
          <span class="right-back"></span>
        </div>
      `;
    } else if (status === "Noite") {
      cardElement.classList.remove("card-meteorologia-dia");
      cardElement.classList.add("card-meteorologia-noite");
      containerElement.innerHTML = `
        <div class="stars left"><i class="fas fa-fw fa-star"></i></div>
        <div class="stars front"><i class="fas fa-fw fa-star"></i></div>
        <span class="moon"></span>
        <div class="stars back"><i class="fas fa-fw fa-star"></i></div>
      `;
    }
  }
}
