var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#future-weather-cards");

var getLocationWeather = function (location) {
  var geolocationApi =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    location +
    "&limit=1&appid=be7c6540adf0957dc646903e1ce56c09";
  fetch(geolocationApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          getCoordinates(data);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weather Dashboard");
    });
};

getLocationWeather("charlotte");

var getCoordinates = function (cityArray) {
  for (var i = 0; i < cityArray.length; i++);
  {
    var latitude = cityArray[0].lat;
    var longitude = cityArray[0].lon;
    console.log(latitude);
    console.log(longitude);
  }
  var currentWeatherApi =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=imperial&appid=be7c6540adf0957dc646903e1ce56c09";
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

  var futureWeatherApi =
    "api.openweathermap.org/data/2.5/forecast/daily?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&cnt=5&appid=be7c6540adf0957dc646903e1ce56c09";
};

var displayCurrentWeather = function (weatherObj) {
  currentWeatherEl.textContent = "";
  var location = weatherObj.name;
  var date = moment().format("MMM DD, YYYY");
  var temp = weatherObj.main.temp;
  var wind = weatherObj.wind.speed;
  var humidity = weatherObj.main.humidity;
  var tempHigh = weatherObj.main.temp_max;
  var tempLow = weatherObj.main.temp_min;

  var dateLocationEl = document.createElement("h3");
  dateLocationEl.textContent = location + " - " + date;
  currentWeatherEl.appendChild(dateLocationEl);

  var tempEl = document.createElement("p");
  tempEl.textContent = "Temperature: " + Math.floor(temp) + "°F";
  currentWeatherEl.appendChild(tempEl);

  var windEl = document.createElement("p");
  windEl.textContent = "Wind Speed: " + wind + " MPH";
  currentWeatherEl.appendChild(windEl);

  var humidityEl = document.createElement("p");
  humidityEl.textContent = "Humidity: " + humidity + "%";
  currentWeatherEl.appendChild(humidityEl);

  var minMaxEl = document.createElement("p");
  minMaxEl.textContent =
    "Today's high: " +
    Math.floor(tempHigh) +
    ". Today's low: " +
    Math.floor(tempLow) +
    ".";
  currentWeatherEl.appendChild(minMaxEl);
};
