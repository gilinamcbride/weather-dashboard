//global variables
var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#future-weather-cards");
var cityInputEl = document.querySelector("#city-input");
var cityFormEl = document.querySelector("#input-form");
var recentSearchEl = document.querySelector("#search-buttons");
var recentSearchBtn;
var searchArray = [];

//function that retrieves locally stored data and creates buttons to the page for the data
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
  // recentSearchBtn.addEventListener(
  //   "click",
  //   getCoordinates(recentSearchBtn.text())
  // );
};

//function to save the city searches to local storage
var saveSearch = function (city) {
  searchArray.push(city);
  localStorage.setItem("city", JSON.stringify(searchArray));
  getRecentSearch();
};

//function that listens for form submit
var submitForm = function (event) {
  event.preventDefault();
  futureWeatherEl.textContent = "";
  var cityInput = cityInputEl.value.trim();
  var city = cityInput.toLowerCase();
  if (city) {
    getCoordinates(city);
    saveSearch(cityInput);
  } else {
    alert("Please enter a city name.");
  }
};
cityFormEl.addEventListener("submit", submitForm);

//function that creates geolocation array from city name the passes information to next function
var getCoordinates = function (location) {
  var geolocationApi =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    location +
    "&limit=1&appid=be7c6540adf0957dc646903e1ce56c09";
  fetch(geolocationApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
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

//function that gets lat and long coordinates from the array
var getLocation = function (cityArray) {
  for (var i = 0; i < cityArray.length; i++);
  {
    var latitude = cityArray[0].lat;
    var longitude = cityArray[0].lon;
    getWeather(latitude, longitude);
  }
};

//function that fetches the API using the coordinates recieved and sends to functions to display information
var getWeather = function (latitude, longitude) {
  var weatherApi =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&exclude=minutely,hourly,alerts&units=imperial&appid=be7c6540adf0957dc646903e1ce56c09";
  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayCurrentWeather(data);
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

//function to display current weather information
var displayCurrentWeather = function (weatherObj) {
  currentWeatherEl.textContent = "";
  var location = cityInputEl.value.trim();
  var date = moment().format("MMM DD, YYYY");
  var temp = weatherObj.current.temp;
  var wind = weatherObj.current.wind_speed;
  var humidity = weatherObj.current.humidity;
  var icon = weatherObj.current.weather[0].icon;
  var uvIndex = weatherObj.current.uvi;

  var dateLocationEl = document.createElement("h3");
  dateLocationEl.textContent = location + " - " + date;
  dateLocationEl.className = "location-title";
  currentWeatherEl.appendChild(dateLocationEl);
  cityInputEl.value = "";

  var iconEl = document.createElement("div");
  iconEl.innerHTML =
    "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png>";
  currentWeatherEl.appendChild(iconEl);

  var tempEl = document.createElement("p");
  tempEl.textContent = "Temperature: " + Math.floor(temp) + "°F";
  currentWeatherEl.appendChild(tempEl);

  var windEl = document.createElement("p");
  windEl.textContent = "Wind Speed: " + Math.floor(wind) + " MPH";
  currentWeatherEl.appendChild(windEl);

  var humidityEl = document.createElement("p");
  humidityEl.textContent = "Humidity: " + humidity + "%";
  currentWeatherEl.appendChild(humidityEl);

  var uvEl = document.createElement("div");
  uvEl.className = "uv-index";
  if (uvIndex < 4) {
    uvEl.innerHTML =
      "<p class='index-title'>UV Index: </p><p class='good index'>" +
      uvIndex +
      "</p>";
  } else if (uvIndex < 8) {
    uvEl.innerHTML =
      "<p class='index-title'>UV Index: </p><p class='medium index'>" +
      uvIndex +
      "</p>";
  } else if (uvIndex <= 11) {
    uvEl.innerHTML =
      "<p class='index-title'>UV Index: </p><p class='bad index'>" +
      uvIndex +
      "</p>";
  }
  currentWeatherEl.appendChild(uvEl);
};

//function to display future weather information
var displayFutureWeather = function (weatherObj) {
  var dailyArray = weatherObj.daily;
  for (var i = 0; i < 6; i++) {
    var temp = dailyArray[i].temp.day;
    var wind = dailyArray[i].wind_speed;
    var humidity = dailyArray[i].humidity;
    var date = moment(date).add(1, "d");
    var dateFormat = moment(date).format("ddd, MMM DD, YYYY");
    var icon = dailyArray[i].weather[0].icon;

    var divEl = document.createElement("div");
    divEl.classList = "future mx-auto justify-content-center";
    futureWeatherEl.appendChild(divEl);

    var dateEl = document.createElement("h3");
    dateEl.className = "future-title";
    dateEl.textContent = dateFormat;
    divEl.appendChild(dateEl);

    var iconEl = document.createElement("div");
    iconEl.innerHTML =
      "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png>";
    divEl.appendChild(iconEl);

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + Math.floor(temp) + " °F";
    divEl.appendChild(tempEl);

    var windEl = document.createElement("p");
    windEl.textContent = "Speed: " + Math.floor(wind) + " MPH";
    divEl.appendChild(windEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";
    divEl.appendChild(humidityEl);
  }
};
