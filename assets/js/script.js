var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#future-weather-cards");
var cityInputEl = document.querySelector("#city-input");
var cityFormEl = document.querySelector("#input-form");
var recentSearchEl = document.querySelector("#search-buttons");
var cityName = cityInputEl.value.trim();
var searchArray = [];
console.log(searchArray);

var getRecentSearch = function () {
  var search = JSON.parse(localStorage.getItem("city"));
  for (var i = 0; i < search.length; i++) {
    buttonName = search[i];
  }
  var recentSearchBtn = document.createElement("button");
  recentSearchBtn.textContent = buttonName;
  recentSearchBtn.setAttribute("type", "submit");
  recentSearchBtn.className = "recent-search-btn";
  recentSearchEl.appendChild(recentSearchBtn);

  // recentSearchBtn.addEventListener("click", getCoordinates());
};

var saveSearch = function (city) {
  searchArray.push(city);
  localStorage.setItem("city", JSON.stringify(searchArray));
  getRecentSearch();
};

var submitForm = function (event) {
  event.preventDefault();
  futureWeatherEl.textContent = "";
  var cityInput = cityInputEl.value.trim();
  var city = cityInput.toLowerCase();
  console.log(city);
  if (city) {
    getCoordinates(city);
    saveSearch(cityInput);
    cityInputEl.value = "";
  } else {
    alert("Please enter a city name.");
  }
};
cityFormEl.addEventListener("submit", submitForm);

var getCoordinates = function (location) {
  var geolocationApi =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    location +
    "&limit=1&appid=be7c6540adf0957dc646903e1ce56c09";
  fetch(geolocationApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          getLocation(data);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weather Dashboard");
    });
};

var getLocation = function (cityArray) {
  for (var i = 0; i < cityArray.length; i++);
  {
    var latitude = cityArray[0].lat;
    var longitude = cityArray[0].lon;
    console.log(latitude);
    console.log(longitude);
    getCurrentWeather(latitude, longitude);
    getFutureWeather(latitude, longitude);
  }
};

var getCurrentWeather = function (latitude, longitude) {
  var currentWeatherApi =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&exclude=daily,minutely,hourly,alerts&units=imperial&appid=be7c6540adf0957dc646903e1ce56c09";
  fetch(currentWeatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayCurrentWeather(data);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weather Dashboard");
    });
};

var getFutureWeather = function (latitude, longitude) {
  var futureWeatherApi =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&exclude=current,minutely,hourly,alerts&units=imperial&appid=be7c6540adf0957dc646903e1ce56c09";
  fetch(futureWeatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayFutureWeather(data);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weather Dashboard");
    });
};

var displayCurrentWeather = function (weatherObj) {
  currentWeatherEl.textContent = "";
  // var location = weatherObj.name;
  var date = moment().format("MMM DD, YYYY");
  var temp = weatherObj.current.temp;
  var wind = weatherObj.current.wind_speed;
  var humidity = weatherObj.current.humidity;
  var icon = weatherObj.current.weather[0].icon;
  var uvIndex = weatherObj.current.uvi;
  console.log(uvIndex);

  var dateLocationEl = document.createElement("h3");
  dateLocationEl.textContent = cityInputEl.value + " - " + date;
  dateLocationEl.className = "location-title";
  currentWeatherEl.appendChild(dateLocationEl);

  var iconEl = document.createElement("div");
  iconEl.innerHTML =
    "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png>";
  currentWeatherEl.appendChild(iconEl);

  var tempEl = document.createElement("p");
  tempEl.textContent = "Temperature: " + Math.floor(temp) + "°F";
  currentWeatherEl.appendChild(tempEl);

  var windEl = document.createElement("p");
  windEl.textContent = "Wind Speed: " + wind + " MPH";
  currentWeatherEl.appendChild(windEl);

  var humidityEl = document.createElement("p");
  humidityEl.textContent = "Humidity: " + humidity + "%";
  currentWeatherEl.appendChild(humidityEl);

  var uvEl = document.createElement("div");
  uvEl.className = "uv-index";
  if (uvIndex < 4) {
    uvEl.innerHTML =
      "<p>UV Index: </p><p class='good index'>" + uvIndex + "</p>";
  } else if (uvIndex < 8) {
    uvEl.innerHTML =
      "<p>UV Index: </p><p class='medium index'>" + uvIndex + "</p>";
  } else if (uvIndex <= 11) {
    uvEl.innerHTML =
      "<p>UV Index: </p><p class='bad index'>" + uvIndex + "</p>";
  }
  currentWeatherEl.appendChild(uvEl);
};

var displayFutureWeather = function (weatherObj) {
  var dailyArray = weatherObj.daily;
  for (var i = 0; i < 5; i++) {
    var temp = dailyArray[i].temp.day;
    var wind = dailyArray[i].wind_speed;
    var humidity = dailyArray[i].humidity;
    var date = moment(date).add(1, "d");
    var icon = dailyArray[i].weather[0].icon;
    console.log(temp);
    console.log(wind);
    console.log(humidity);
    console.log(icon);

    var divEl = document.createElement("div");
    divEl.classList = "future";
    futureWeatherEl.appendChild(divEl);

    var dateEl = document.createElement("h3");
    dateEl.textContent = date;
    divEl.appendChild(dateEl);

    var iconEl = document.createElement("div");
    iconEl.innerHTML =
      "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png>";
    divEl.appendChild(iconEl);

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + Math.floor(temp) + " °F";
    divEl.appendChild(tempEl);

    var windEl = document.createElement("p");
    windEl.textContent = "Speed: " + Math.floor(wind) + "MPH";
    divEl.appendChild(windEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";
    divEl.appendChild(humidityEl);
  }
};
