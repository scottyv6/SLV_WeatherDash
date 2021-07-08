const searchFormEl = document.querySelector('#search-form');
const cityInputEl = document.querySelector('#city');
const apiKey = "d1292f8ec8b8d3c9244fddf86871b785";

var formSubmitHandler = function(event) {
    event.preventDefault();
     let city = cityInputEl.value;
     console.log('cityInputEl.nodeValue ' + cityInputEl.value);
     if (city) {
         getWeatherdata(city);
         console.log('city ' + city);
     }
     else {
         alert('Please enter a valid City'); 
     }
    
}

var getWeatherdata = function(city) {
    let apiUrl = "http://api.openweathermap.org/data/2.5/find?q=" + city + "&units=metric&appid=" + apiKey;
    var lat;
    var lon;
    
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          console.log('City ' + data.list[0].name);
          console.log('temp ' + data.list[0].main.temp + '°C');
          console.log('wind ' + data.list[0].wind.speed + ' KPH');
          console.log('humidity ' + data.list[0].main.humidity + '%');
          var unixTime = moment.unix(data.list[0].dt).format("DD/MM/YYYY");
          console.log('date ' + unixTime);
          lat = data.list[0].coord.lat;
          console.log("lat " + lat);
          lon = data.list[0].coord.lon;
          console.log("lon " + lon);
          
          
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeatherMap');
    });

    let apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;

    fetch(apiUrl2)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          console.log('City ' + data.list[0].name);
          console.log('temp ' + data.list[0].main.temp + '°C');
          console.log('wind ' + data.list[0].wind.speed + ' KPH');
          console.log('humidity ' + data.list[0].main.humidity + '%');
          var unixTime = moment.unix(data.list[0].dt).format("DD/MM/YYYY");
          console.log('date ' + unixTime);
          
          
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeatherMap');
    });

};

searchFormEl.addEventListener ('submit', formSubmitHandler);