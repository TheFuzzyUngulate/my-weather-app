const weather_key = "28e9a039f7ce402796f31959220106";
const weather_form = document.getElementById('weather-request-form');
const weather_form_date = weather_form.querySelectorAll("input[name=time]");
const weather_form_city = weather_form.querySelector("input[name=city]");
const weather_form_submit = weather_form.querySelector("#weather-request-submit");
const weather_announcer = document.getElementById('weather-announcer');
const weather_logo = document.getElementById('weather-request-logo');
const weather_result = {
  city: null,
  time: null
};

weather_form_submit.addEventListener('click', () => {

  weather_result.city = weather_form_city.value;

  for (time of weather_form_date) {
    if (time.checked) {
      weather_result.time = time.id;
      break;
    }
  }

  try {
    switch(weather_result.time) {
      case 'current':
        checkCurrentWeather();
        break;
    }
  } catch(error) {console.log(error);}

});

function checkCurrentWeather() {

  let xhttp = new XMLHttpRequest();

  xhttp.open('GET', `http://api.weatherapi.com/v1/forecast.json?q=${weather_result.city}&key=${weather_key}&days=3`, true);
  xhttp.responseType = 'text';

  xhttp.addEventListener('load', (ev) => {
    console.log(`Event status: ${xhttp.status}`);
    const data = JSON.parse(xhttp.response);
    console.log(xhttp.response);
    if (data.location) {
      // display results
      displayCurrentWeatherResult(data);
    } else {
      console.log("error");
      weather_announcer.innerHTML = "Error!";
    }
  });

  xhttp.send();
}

function checkHourlyWeather() {

  let request = new XMLHttpRequest();

  request.open

}

function displayCurrentWeatherResult(data) {
  weather_announcer.className = 'weather-holder';
  while (weather_announcer.lastElementChild) {
    weather_announcer.removeChild(weather_announcer.lastElementChild);
  }
  for (day of data.forecast.forecastday) {
    console.log(day.date);
  }
  createWeatherDisplay(weather_announcer, data);
}

function createWeatherDisplay(mydiv, data) {

  let weather_logo_holder = document.createElement('div');
  weather_logo_holder.className = "weather-holder-holder";
  mydiv.appendChild(weather_logo_holder);

  let weather_logo = document.createElement('img');
  weather_logo.src = `${data.current.condition.icon.substring(21)}`;
  weather_logo.className = "weather-holder-holder-logo";
  weather_logo_holder.appendChild(weather_logo);

  let weather_info_temp = document.createElement('div');
  weather_info_temp.className = "weather-holder-holder-temperature";
  weather_info_temp.innerHTML = `${data.current.temp_c}°C`;
  weather_logo_holder.appendChild(weather_info_temp);

  let weather_info_loc = document.createElement('div');
  weather_info_loc.className = "weather-holder-location";
  mydiv.appendChild(weather_info_loc);

  let weather_info_loc_city = document.createElement('div');
  weather_info_loc_city.style.fontSize = '20pt';
  weather_info_loc_city.style.fontWeight = 'bold';
  weather_info_loc_city.innerHTML = `${data.location.name}<br>`;
  weather_info_loc.appendChild(weather_info_loc_city);

  let weather_info_loc_country = document.createElement('div');
  weather_info_loc_country.style.fontWeight = 'normal';
  weather_info_loc_country.style.fontSize = '14px';
  weather_info_loc_country.innerHTML = `${data.location.region}, ${data.location.country}`;
  weather_info_loc.appendChild(weather_info_loc_country);

  weather_info_loc.appendChild(weather_info_loc_country);

}
