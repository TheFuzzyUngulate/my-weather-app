const my_key = "28e9a039f7ce402796f31959220106";
const base_url = "http://api.weatherapi.com/v1/";
const weather_form = document.getElementById('weather-request-form');
const weather_form_date = weather_form.querySelectorAll("div.weather-option-button");
const weather_form_city = weather_form.querySelector("#city");
const weather_form_submit = weather_form.querySelector("#weather-request-submit");
const weather_announcer = document.getElementById('weather-announcer');
const weather_logo = document.getElementById('weather-request-logo');

const weather_result = {
  city: null,
  time: null
};

weather_form_submit.addEventListener('click', handleQuery);
weather_form_city.addEventListener('keyup', (e) => {
  switch (e.key) {
    case "Enter":
      handleQuery();
      break;
  }
});

for (let x = 0; x < weather_form_date.length; x++) {
  weather_form_date[x].addEventListener('click', () => {

    for (butn of weather_form_date) {
      butn.className = '';
    }
    weather_form_date[x].className = 'time-select-on';

  });
}

function handleQuery() {
  weather_result.city = weather_form_city.value;
  for (time of weather_form_date) {
    if (time.classList.contains('time-select-on')) {
      weather_result.time = time.id;
      break;
    }
  }

  try {
    switch(weather_result.time) {
      case 'daily':
        getDailyWeather();
        break;
      case 'hourly':
        getHourlyWeather();
        break;
    }
  } catch(error) {console.log(error);}
}

function getCurrentWeather() {

}

function getDailyWeather() {
  console.log("Daily!");

  let today = new Date();
  let fulldate = null;
  var x = [today.getDate() + 7, today.getMonth() + 1];
  for (i in x) {
    if (parseInt(x[i]) < 10) x[i] = `0${x[i].toString()}`;
  }
  fulldate = `${today.getFullYear()}-${x[1]}-${x[0]}`;

  let response = new XMLHttpRequest();
  response.open('GET', `${base_url}forecast.json?key=${my_key}&q=${weather_result.city}&days=3`, true);
  response.responseType = 'text';
  response.addEventListener('readystatechange', (ev) => {
    if (response.readyState === 4) {
      if (response.status === 200) {
        let x = JSON.parse(response.response);
        let daily = x.forecast.forecastday;
        let curr_loc = x.location;

        console.log(x);

        weather_announcer.innerHTML = "";

        for (i in daily) {
          let curr_day = daily[i];
          drawDailyToken(curr_day, curr_loc);
        }
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`);
        noResultsFound(response.status, response.statusText);
      }
    }
  });
  response.send();

}

function getHourlyWeather() {
  console.log("Hourly!");

  let response = new XMLHttpRequest();
  response.open('GET', `${base_url}forecast.json?key=${my_key}&q=${weather_result.city}&days=0`, true);
  response.responseType = 'text';
  response.addEventListener('readystatechange', (ev) => {
    if (response.readyState === 4) {
      if (response.status === 200) {
        let x = JSON.parse(response.response);
        let hourly = x.forecast.forecastday[0].hour;
        let curr_loc = x.location;

        console.log(x);

        weather_announcer.innerHTML = "";

        for (i in hourly) {
          let curr_hour = hourly[i];
          drawHourlyToken(curr_hour, curr_loc);
        }
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`);
        noResultsFound(response.status, response.statusText);
      }
    }
  });
  response.send();
}

function noResultsFound(err, desc) {
  const the_wrapper = document.getElementById("weather-wrapper");
  const all_children = the_wrapper.querySelectorAll('div');

  const error_display = document.createElement('div');
  error_display.innerHTML = `Error ${err}: ${desc}`;
  the_wrapper.appendChild(error_display);

  for (mydiv of all_children) {
    mydiv.innerHTML = '';
    mydiv.style.display = 'none';
  }
}

function drawHourlyToken(myhour, myloc) {
  const x = weather_announcer;
  x.style.display = 'inline-block';

  const back_div = document.createElement("div");
  back_div.className = 'weather-holder';
  back_div.style.textAlign = 'center';
  x.appendChild(back_div);

  const curr_hour = document.createElement("div");
  curr_hour.className = 'weather-title';
  curr_hour.innerHTML = `${myhour.time.slice(11)}`;
  back_div.appendChild(curr_hour);

  const div_img = document.createElement("img");
  div_img.className = 'weather-icon';
  div_img.src = myhour.condition.icon.replace('//cdn.weatherapi.com/', '');
  back_div.appendChild(div_img);

  const curr_temp = document.createElement("div");
  curr_temp.className = 'weather-temp';
  curr_temp.innerHTML = `${myhour.temp_c}<sup>°C</sup>`;
  back_div.appendChild(curr_temp);

  const curr_precip = document.createElement("div");
  curr_precip.className = 'weather-extra-info';
  curr_precip.innerHTML = `Precipitation: ${myhour.precip_mm}mm`;
  back_div.appendChild(curr_precip);

  const curr_humid = document.createElement("div");
  curr_humid.className = 'weather-extra-info';
  curr_humid.innerHTML = `Humidity: ${myhour.humidity}%`;
  back_div.appendChild(curr_humid);

}

function drawDailyToken(myday, myloc) {
  const x = weather_announcer;

  const month_list = [
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November", "December"
  ]

  const back_div = document.createElement("div");
  back_div.className = 'weather-holder';
  back_div.style.textAlign = 'center';
  x.appendChild(back_div);

  const curr_day = document.createElement("div");
  curr_day.className = 'weather-title';
  curr_day.innerHTML = `${month_list[myday.date.slice(5,7) - 1]} ${myday.date.slice(8)}`;
  back_div.appendChild(curr_day);

  const div_img = document.createElement("img");
  div_img.className = 'weather-icon';
  div_img.src = myday.day.condition.icon.replace('//cdn.weatherapi.com/', '');
  back_div.appendChild(div_img);

  const ave_temp = document.createElement("div");
  ave_temp.className = 'weather-temp';
  ave_temp.innerHTML = `${myday.day.avgtemp_c}<sup>°C</sup>`;
  back_div.appendChild(ave_temp);

  const max_min_temp = document.createElement("div");
  max_min_temp.className = 'weather-max-min-temp';
  max_min_temp.innerHTML = `${myday.day.maxtemp_c}°<span>C</span> / ${myday.day.mintemp_c}°<span>C</span>`;
  back_div.appendChild(max_min_temp);

  const rain_chance = document.createElement("div");
  rain_chance.className = 'weather-extra-info';
  rain_chance.innerHTML = `Chance of rain: ${myday.day.daily_chance_of_rain}%`;
  back_div.appendChild(rain_chance);

  const max_wind = document.createElement("div");
  max_wind.className = 'weather-extra-info';
  max_wind.innerHTML = `Max. winds: ${myday.day.maxwind_kph}km/h`;
  back_div.appendChild(max_wind);

  const tot_precip = document.createElement("div");
  tot_precip.innerHTML = `Total precipitation: ${myday.day.totalprecip_mm}mm`;
  tot_precip.className = 'weather-extra-info';
  back_div.appendChild(tot_precip);

}
