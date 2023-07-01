// customchart.js

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Função para inicializar um gráfico genérico
function initializeChart(chartId, label, data, options) {
  var ctx = document.getElementById(chartId).getContext('2d');
  var chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: [],
          datasets: [{
              label: label,
              data: data,
              lineTension: 0.3,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderColor: "#A6A6A6",
              pointRadius: 3,
              pointBackgroundColor: "#2C2C2C",
              pointBorderColor: "#2C2C2C",
              pointHoverRadius: 3,
              pointHoverBackgroundColor: "rgba(190, 190, 190, 1)",
              pointHoverBorderColor: "rgba(190, 190, 190, 1)",
              pointHitRadius: 10,
              pointBorderWidth: 2,
          }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
            console.log(tooltipItem)
              return tooltipItem.yLabel;
            }
          }
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display: false
              },
              tooltip: {
                  backgroundColor: "rgb(255,255,255)",
                  bodyFontColor: "#858796",
                  titleFontColor: '#6e707e',
                  titleFontSize: 14,
                  borderColor: '#dddfeb',
                  borderWidth: 1,
                  caretPadding: 10,
                  callbacks: {
                      label: function (context) {
                          var label = context.dataset.label || '';
                          if (label) {
                              label += ': ';
                          }
                          if (context.parsed.y !== null) {
                              label += context.parsed.y;
                          }
                          return label;
                      }
                  }
              }
          },
          scales: {
              x: {
                  type: 'time',
                  time: {
                      unit: 'hour',
                      displayFormats: {
                          hour: 'HH:mm'
                      }
                  },
                  ticks: {
                      autoSkip: true,
                      maxTicksLimit: 10
                  },
                  grid: {
                      display: true,
                      drawBorder: true
                  }
              },
              y: {
                  grid: {
                      display: true,
                      drawBorder: true
                  },
                  ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 5,
                      padding: 10,
                      callback: function (value, index, values) {
                          return value;
                      }
                  }
              }
          }
      }
  });

  return chart;
}


// Função para inicializar o gráfico de luminosidade
function initializeChartLum(chartId, label, data, options) {
  var ctx = document.getElementById(chartId).getContext('2d');
  var gradientLuz = ctx.createLinearGradient(0, 0, 0, 200);
  gradientLuz.addColorStop(0, '#A6A6A6'); // Cor inicial
  gradientLuz.addColorStop(1, '#2C2C2C'); // Cor final
  var gradientEscuro = ctx.createLinearGradient(0, 0, 0, 200);
  gradientEscuro.addColorStop(0, '#fcbb04'); // Cor inicial
  gradientEscuro.addColorStop(1, '#fffc00'); // Cor final
  
  var chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 100],
          backgroundColor: [
            gradientLuz,
            gradientEscuro
          ],
          borderColor: [
            gradientLuz,
            gradientEscuro
          ],
          borderWidth: 1
        }]
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      },
          responsive: true,
          cutout: '70%',
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display: false
              },
              rotation: -0.75 * Math.PI,
              circumference: 1.5 * Math.PI,
              tooltip: {
                  backgroundColor: "rgb(255,255,255)",
                  bodyFontColor: "#858796",
                  titleFontColor: '#6e707e',
                  titleFontSize: 14,
                  borderColor: '#dddfeb',
                  borderWidth: 1,
                  caretPadding: 10,
                  callbacks: {
                      label: function (context) {
                          var label = context.dataset.label || '';
                          if (label) {
                              label += ': ';
                          }
                          if (context.parsed.y !== null) {
                              label += context.parsed.y;
                          }
                          return label;
                      }
                  }
              }
          },
          scales: {
              x: {
                  type: 'time',
                  time: {
                      unit: 'hour',
                      displayFormats: {
                          hour: 'HH:mm'
                      }
                  },
                  ticks: {
                      autoSkip: true,
                      maxTicksLimit: 10
                  },
                  grid: {
                      display: true,
                      drawBorder: true
                  }
              },
              y: {
                  grid: {
                      display: true,
                      drawBorder: true
                  },
                  ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 5,
                      padding: 10,
                      callback: function (value, index, values) {
                          return value;
                      }
                  }
              }
          }
      });

  return chart;
}


// Função para atualizar os dados de um gráfico genérico
function updateChart(chart, label, data) {
  // Atualiza os dados do gráfico
    //console.log(chart + " - " + label + " - " + data);
    // Update chart labels
    var time = label.split(' ')[1].split(':').slice(0, 2).join(':');

    //console.log(time);
    chart.data.labels.push(...[time]);
    chart.data.datasets[0].data.push(...data);

    // Atualiza o gráfico
    chart.update();
}

function updateChartLum(chart, label, data) {
// Atualiza os dados do gráfico
var lastValue = data[data.length - 1];
var percentage = lastValue / 4000; // Valor máximo para definir a porcentagem (4.000 neste exemplo)

chart.data.datasets[0].data = [percentage, 1 - percentage];

// Atualiza o gráfico
chart.update();
  }
