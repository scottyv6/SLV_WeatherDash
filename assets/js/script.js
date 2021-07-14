const apiKey = "d1292f8ec8b8d3c9244fddf86871b785";
const cityInputEl = document.getElementById('city');
const todayContainer = document.getElementById('todaysWeather');
const forecastContainer = document.getElementById('forecastWeather');
const cityBtnContainer = document.getElementById('cityBtns');

/* get weather does 2 api calls. The first uses a city as a serch parameter and returns the 
latitude and longitude which is used by the second api call to return the weather data. The
data is returned in an object. */
function getWeather(city) {
    return fetch(
    `https://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&appid=${apiKey}`
    ).then( (response) => response.json())
    .then((response) => {

        const lat = response.list[0].coord.lat;
        const lon = response.list[0].coord.lon;

        return getOneCall(lat, lon)
            .then(oneCallResponse => {
                return {
                    currentWeather: response,
                    oneCallWeather: oneCallResponse,
                }
            });
    } )
}

//This function fetched the onecall api and is called by getWeather
function  getOneCall(lat,lon) {
    return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    ).then ((response) => response.json());
    
}

//This function clears the page ready for now data to be diplayed
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//This function creates the button of a city that has been searched
function createCityBtn (city) {
    //const li = document.createElement('li')
    const cityButton = document.createElement('button')
    cityButton.setAttribute('id', city);
    cityButton.setAttribute('class', 'cityBtn');
    cityButton.textContent = city;
    //li.appendChild(cityButton);
    cityBtnContainer.appendChild(cityButton);

    cityButton.addEventListener('click', function() {
        console.log('check' + city);
        //
        const userInput = city;
    
        // clear display of previous items if they exist.
        removeAllChildNodes (todayContainer);
        removeAllChildNodes (forecastContainer);
    
        // get weather provides the data which is then extracted and displayed on the page
        getWeather(userInput)
            .then((response) => {
           
            const cityName = response.currentWeather.list[0].name;
            const dateNow = moment.unix(response.oneCallWeather.current.dt).format("DD/MM/YYYY");
            const temp = response.oneCallWeather.current.temp;
            const wind = response.oneCallWeather.current.wind_speed;
            const humidity = response.oneCallWeather.current.humidity;
            const uvi = response.oneCallWeather.current.uvi;

            const card = createCurrentCard(
                cityName,
                dateNow,
                temp,
                wind,
                humidity,
                uvi
            );



            todayContainer.appendChild(card);
            // response.oneCallWeather.daily contains an array of weather forecast data for 8 day. 
            // starting slice at 1 to start forecast at the next day. 
            const forecasts = response.oneCallWeather.daily.slice(1, 6);
            // loops through the daiky array and outputs 5-day forcast to the page.
            for (let i = 0; i < forecasts.length; i++){
                const forecast = forecasts[i];
                const card = createForecastCard(
                    moment.unix(forecast.dt).format("DD/MM/YYYY"),
                    forecast.weather[0].icon,
                    forecast.weather[0].description,
                    forecast.temp.max,
                    forecast.temp.min,
                    forecast.wind_speed,
                    forecast.humidity
                )
                forecastContainer.appendChild(card);
            }
        })
    })
    // add to local storage
    let citiesArray = getCities();
    console.log (Array.isArray(citiesArray));
    console.log(citiesArray.includes(city))
    if (!citiesArray.includes(city)) {
        citiesArray.push(city);
    }
    localStorage.setItem("cities", JSON.stringify(citiesArray));
    
}

function getCities() {
    return JSON.parse(localStorage.getItem("cities")) || [];
}

// create function to load local storage
function loadButtons() {
    let citiesArray = getCities();
    if (citiesArray) {
        for (let i = 0; i < citiesArray.length; i++) {
            createCityBtn(citiesArray[i]);
        }
    }
}


//When a city is selected 
cityInputEl.addEventListener("change", function(event){
    event.preventDefault()
    const userInput = event.target.value;
    
    // clear display of previous items if they exist.
    removeAllChildNodes (todayContainer);
    removeAllChildNodes (forecastContainer);
    
    // get weather provides the data which is then extracted and displayed on the page
    getWeather(userInput)
        .then((response) => {
           
            const cityName = response.currentWeather.list[0].name;
            const dateNow = moment.unix(response.oneCallWeather.current.dt).format("DD/MM/YYYY");
            const temp = response.oneCallWeather.current.temp;
            const wind = response.oneCallWeather.current.wind_speed;
            const humidity = response.oneCallWeather.current.humidity;
            const uvi = response.oneCallWeather.current.uvi;

            const card = createCurrentCard(
                cityName,
                dateNow,
                temp,
                wind,
                humidity,
                uvi
            );

            if (cityName) {
                createCityBtn (cityName);
            }

            todayContainer.appendChild(card);
            // response.oneCallWeather.daily contains an array of weather forecast data for 8 day. 
            // starting slice at 1 to start forecast at the next day. 
            const forecasts = response.oneCallWeather.daily.slice(1, 6);
            // loops through the daiky array and outputs 5-day forcast to the page.
            for (let i = 0; i < forecasts.length; i++){
                const forecast = forecasts[i];
                const card = createForecastCard(
                    moment.unix(forecast.dt).format("DD/MM/YYYY"),
                    forecast.weather[0].icon,
                    forecast.weather[0].description,
                    forecast.temp.max,
                    forecast.temp.min,
                    forecast.wind_speed,
                    forecast.humidity
                )
                forecastContainer.appendChild(card);
            }
        })
})

// Creates the html to display the data passed in. Displays the current weather.
function createCurrentCard (city, date, temp, wind, humidity, uvi) {

    const article = document.createElement("article");
    article.setAttribute('class', 'card');

    // Create heading with city name and Date
    const h2 = document.createElement("h2");
    const span1 = document.createElement("span");
    span1.setAttribute('id', 'mainCity');
    span1.textContent = city;
    h2.appendChild(span1);
    const span2 = document.createElement("span");
    span2.setAttribute('id', 'mainDate');
    span2.textContent = ` (${date})`;
    h2.appendChild(span2);

    article.appendChild(h2);

    const tempEl = document.createElement('p');
    tempEl.textContent = `Temp: ${temp} °C`;
    article.appendChild(tempEl);

    const windEl = document.createElement('p');
    windEl.textContent = `Wind: ${wind} km/h`;
    article.appendChild(windEl);

    const humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${humidity} %`;
    article.appendChild(humidityEl);

    const uviEl = document.createElement('p');
    const uv1 = document.createElement('span');
    uv1.textContent = 'UV Index: ';
    uviEl.appendChild(uv1);
    const uv2 = document.createElement('span');
    uv2.setAttribute('class', getUVClass(uvi));
    uv2.textContent = uvi;
    uviEl.appendChild(uv2);
    article.appendChild(uviEl);

    return article;
}

// Creates the html to display the data passed in. Displays the 5-day forcast.
function createForecastCard (date, icon, description, max, min, wind, humidity) {

    const article = document.createElement("article");
    article.setAttribute('class', 'card forecast-card');

    // Create heading with city name and Date
    const h4 = document.createElement("h4");
    h4.textContent = date;
    article.appendChild(h4);

    const iconEl = document.createElement('img');
    iconEl.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);
    iconEl.setAttribute('alt', `${description} icon`);
    article.appendChild(iconEl);

    const maxEl = document.createElement('p');
    maxEl.textContent = `Max: ${max} °C`;
    article.appendChild(maxEl);

    const minEl = document.createElement('p');
    minEl.textContent = `Min: ${min} °C`;
    article.appendChild(minEl);

    const windEl = document.createElement('p');
    windEl.textContent = `Wind: ${wind} km/h`;
    article.appendChild(windEl);

    const humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${humidity} %`;
    article.appendChild(humidityEl);

    return article;
}
//used to change the background of the uv display
function getUVClass(uvi) {
    let uvclass;
    if (uvi < 3) {
        uvclass = 'low';
    } else if (uvi < 6) {
        uvclass = 'moderate';
    } else if (uvi < 8) {
        uvclass = 'high';
    } else if (uvi < 11) {
        uvclass = 'veryhigh';
    } else {
        uvclass = 'extreme';
    }
    return uvclass;
}
loadButtons();