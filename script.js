const SearchBar = document.querySelector(".search-bar");//It will represent the searchbar where the users will search for their weather data
const SearchButton = document.querySelector(".search-button");//Selects the search button that will trigger the search results
const APIKey = "e1032a3639ed6c6c3ece1c9c7c577fd9";//This api key is to track the source of the API request, in this case the OpenWeatherMap API Key
const Error = document.querySelector(".error-message");//Selects the source of the error message that will be displayed in case there is an error while fetching the user request
const SearchCity = document.querySelector(".permanent-message");//Selects the message that will be shown permenantly on the interface 
const WeatherForecast = document.querySelector(".weatherdatacontainer");//This selects the section that contains all the relevant weather data
const SelectedCity = document.querySelector(".city");//The element is selected that will show the city name
const SelectedTemp = document.querySelector(".temp");//Selects the element from the html structure that represents the temperature of the searched city
const SelectedHumid = document.querySelector(".humid");//Selects the element from the html structure that represents the humidity of the searched city
const SelectedWind = document.querySelector(".wind-speed");//Selects the element from the html structure that represents the wind speed data of the searched city
const WeatherIcon = document.querySelector(".weather-icon");//Selects the element that holds the image for the changing weather based on the weather pattern
const DateUpdate = document.querySelector(".date");//Selects the element that displays the date
const forecastItemsContainer = document.querySelector(".forecast");//selects the container in the html document that holds all the strcture for the forecast items
const CurrentLocationButton = document.querySelector(".current-location-button");//Selects the current location button that will trigger search results based on the user's location

SearchButton.addEventListener("click", ()=> //an eventlistener that activates the following functionalities upon clicking the search button
{
    if(SearchBar.value.trim() !== '')//After clicking the search button, the if condition verifies whether or not the searchbar is empty after trimming out all the white spaces
    {
        UpdateWeather(SearchBar.value)//With this function call the click will automatically showcase the updated weather data for the searched city
        SearchBar.value = ''//The searchbar will become empty simultaneously with generating results
        SearchBar.blur()//It removes focus from the searchbar
    };
})

SearchBar.addEventListener("keydown", (event)=>//an eventlistener that activates the following functionalities pressing a specific key on the keyboard
{
    if(event.key == 'Enter' && SearchBar.value.trim() !== '')//After pressing the enter key, the if condition verifies whether or not the searchbar is empty after trimming out all the white spaces
    {
        UpdateWeather(SearchBar.value)
        SearchBar.value = ''
        SearchBar.blur()
    }
})

async function FetchWeatherData(endPoint, city)//An async function is used to fetch the relevant data from the OpenWeatherMap API with two parameters. endPoint is used to access a specific part of the URL e.g: weather or forecast
{
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${APIKey}&units=metric`//The API URL has been stored in a variable called apiURL with specific parts altered with some parameters and variables whose value would be passed here when the user searches for a place
    const response = await fetch(apiURL)//The program is making an HTTP request to the URL stored in apiURL and waiting for the server to respond before continuing
    return response.json();//returns a Promise that resolves to the parsed JavaScript object resulting from the JSON-formatted response body
}

function GetWeatherIcon(id)//This function returns weather icons based on the weather ids of different weather pattern accessed from the OpenWeatherMap 
{
    if (id <= 232) return "https://cdn3.iconfinder.com/data/icons/weather-16/256/Storm-512.png"
    if (id <= 321) return "https://cdn-icons-png.flaticon.com/512/6423/6423427.png"
    if (id <= 531) return "https://static.vecteezy.com/system/resources/thumbnails/009/585/430/small/rain-drop-from-cartoony-cloud-free-free-png.png"
    if (id <= 622) return "https://i.pinimg.com/564x/73/d9/94/73d99425905c3718dbf81594e8d5ee7e.jpg"
    if (id <= 800) return "https://png.pngtree.com/png-clipart/20230813/original/pngtree-vector-illustration-of-weather-icon-sun-with-clear-sky-vector-picture-image_10530522.png"
    else return "https://cdn4.iconfinder.com/data/icons/weather-129/64/weather-2-512.png"
}

function CurrentDate()//initiates the the date format which will be followed by the curreny date structure
{
    const CurrentDateInfo = new Date();//This line creates a new Date object and stores it in the CurrentDateInfo variable. new Date() is a built-in javascript constructor that returns the current date and time as a Date object
    const options = //it stores the information on how the date elements should be formatted
    {
        weekday: "short",//Displays the weekday name in the abbreviated format e.g: "Mon"
        year: "numeric",//displays the year in four digits e.g: "2025"
        month: "short",//displays the month in shortened format e.g: "Sep"
        day: "numeric",//diplays the day numerically e.g: "11"
    }
    return CurrentDateInfo.toLocaleDateString('en-GB', options)//The toLocaleDateString() method of Date instances returns a string with a language-sensitive representation of the date portion of this date in the local timezone. en-GB is for English language of Great Britain

}

async function UpdateWeather(city)//This function updates the weather information for a specific city
{
    const WeatherReport = await FetchWeatherData('weather', city)//It fetches weather data of a city where 'weather' has been taken as an argument for endPoint
    if(WeatherReport.cod !== 200)//when the cod(short for API code) shows 200 then it is not an error, so this condition checks whether or not the result is 200
    {
        Display(Error)//In case of an error, the Display passes the Error to show the error message
        return 
    }
    console.log(WeatherReport)
    const 
    {
        name: country,
        main: {temp,humidity},
        weather: [{id}],
        wind: {speed}
    }=WeatherReport //extracts useful data from the WeatherReport object retrieved from the OpenWeatherMap API 
    SelectedCity.textContent = country; //this updates the SlectedCity with fetched data from country value
    SelectedTemp.textContent = temp + ' °C';//this updates the SelectedTemp with fetched data from temp value 
    SelectedHumid.textContent = humidity + ' %';//this updates the SelectedHumid with fetched data from humidity value 
    SelectedWind.textContent = speed + ' km/h';//this updates the SelectedWind with fetched data from speed value 
    WeatherIcon.src = `${GetWeatherIcon(id)}`;//this updates the WeatherIcon with the relevant weather icon for the location
    DateUpdate.textContent = CurrentDate();//this updates the Date in the updated information by calling the CurrentDate() function
    await updatedForecasts(city);//It calls a function that fetches the 5-day weather forecast data for the searched city from the OpenWeatherMap API
    Display(WeatherForecast)//calls the Display function with WeatherForecast as an argument

}

async function UpdateWeatherByCoords(lat, lon) {//This function updates the weather based on the coordinates(Latitude and Longitude) of the current location of the user's device
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;
    const response = await fetch(apiURL);
    const WeatherReport = await response.json();

    if (WeatherReport.cod !== 200) {
        Display(Error);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id }],
        wind: { speed },
    } = WeatherReport;
    //updates the elements again but this time with the current location weather data
    SelectedCity.textContent = country;
    SelectedTemp.textContent = temp + ' °C';
    SelectedHumid.textContent = humidity + ' %';
    SelectedWind.textContent = speed + ' km/h';
    WeatherIcon.src = `${GetWeatherIcon(id)}`;
    DateUpdate.textContent = CurrentDate();

    await updatedForecastsByCoords(lat, lon);//calls the function that fetches the 5-day forecast of the current location
    Display(WeatherForecast);
}

async function updatedForecasts(city)
{
    const forecast = await FetchWeatherData('forecast', city)
    const initialTime = '12:00:00'
    const recentDate = new Date().toISOString().split('T')[0]//converts this Date object into a string in ISO format. .split('T')[0] splits the ISO string at the "T" character and takes the first part, which is the date in YYYY-MM-DD format
    forecastItemsContainer.innerHTML = ''//display the forecast items in the weather application
    forecast.list.forEach(forecastWeather=>//By going through the forecast list, display only the forecast data of future noons
    {
        if(forecastWeather.dt_txt.includes(initialTime) && !forecastWeather.dt_txt.includes(recentDate))
        {
            updatedForecastItems(forecastWeather)
        }
        
    }
    )
}

async function updatedForecastsByCoords(lat, lon) {//the function works similar to the updatedForecasts(city) and only accesses information based on current location
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;
    const response = await fetch(apiURL);
    const forecast = await response.json();
    const initialTime = '12:00:00';
    const recentDate = new Date().toISOString().split('T')[0];
    forecastItemsContainer.innerHTML = '';

    forecast.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(initialTime) && !forecastWeather.dt_txt.includes(recentDate)) {
            updatedForecastItems(forecastWeather);
        }
    });
}


function updatedForecastItems(WeatherReport)//Inserts forecast items into the forecast container based on the WeatherReport
{
    console.log(WeatherReport)
    const {dt_txt:date,
        weather:[{id}],
        main:{temp, humidity},
        wind: {speed}
    }=WeatherReport

    const dateTaken = new Date(date)
    const dateOptions =
    {
        weekday: "short",
        month: "short",
        day: "numeric",
    }
    const dateResult= dateTaken.toLocaleDateString('en-GB', dateOptions)

    const forecastItem = //formats the forecast data according to the updated information
        `<div class="forecast-item text-center lg:h-70 border md:h-70 md:w-40 sm:h-70 sm:w-40 sm:gap-1">
        <p class="text-3xl">${dateResult}</p>
        <img src="${GetWeatherIcon(id)}" alt="weather-icon" class="weather-icon h-10 place-self-center">
        <p class="text-3xl">${temp} °C </p>
        <img src="https://static.thenounproject.com/png/2280622-200.png" alt="humidity icon" class="h-10 place-self-center">
        <p class="text-3xl">${humidity} %</p>
        <img src="https://static.thenounproject.com/png/1824196-200.png" alt="windspeed icon" class="h-10 place-self-center">
        <p class="text-3xl">${speed} km/h</p>
      </div>`
      forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)//This line inserts new HTML content (forecastItem) into the forecastItemsContainer element. 
}

function Display(section)//This function decides which elements to hide and which ones to display
{
    [WeatherForecast, SearchCity, Error]
    .forEach(section=>section.style.display = 'none')//This line of code hides the three sections: WeatherForecast, SearchCity, and Error
    section.style.display = ''//After hiding all the sections, this line makes the specified section visible by setting its display property back to an empty string
}

CurrentLocationButton.addEventListener("click", () => {//this eventListener is utilised to access the current location of the user's device upon clicking the current-location-button
    if (navigator.geolocation) {//This condition checks if the navigator.geolocation API is available in the user's browser without which the geographical location of the user would not be accessed
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;//This extracts the latitude and longitude from the position.coords object
            UpdateWeatherByCoords(latitude, longitude);//This calls a function UpdateWeatherByCoords() with the latitude and longitude as arguments to fetch weather information based on the user's current location.
        }, () => {
            alert("Unable to retrieve your location."); //this gets triggered when there is any error in accessing the location
        });
    } else {
        alert("Geolocation is not supported by this browser.");//this gets triggered if the user's browser does not have navigator.geolocation API
    }
});
