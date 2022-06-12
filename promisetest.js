const key = "28e9a039f7ce402796f31959220106";
const xhttp = new XMLHttpRequest();

xhttp.open('GET', `http://api.weatherapi.com/v1/forecast.json?q=Paris&key=${key}`, true);
xhttp.responseType = 'text';

xhttp.addEventListener('load', (ev) => {
  console.log(`Event status: ${xhttp.status}`);
  const result = JSON.parse(xhttp.response);
  console.log(xhttp.response);
  console.log(result.location.name);

});

xhttp.send();
