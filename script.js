const SearchBar = document.querySelector(".search-bar");
const SearchButton = document.querySelector(".search-button");
const APIKey = "e1032a3639ed6c6c3ece1c9c7c577fd9";
const Error = document.querySelector(".error-message");
const SearchCity = document.querySelector(".permanent-message");
const WeatherForecast = document.querySelector(".weatherdatacontainer");
const SelectedCity = document.querySelector(".city");
const SelectedTemp = document.querySelector(".temp");
const SelectedHumid = document.querySelector(".humid");
const SelectedWind = document.querySelector(".wind-speed");
const WeatherIcon = document.querySelector(".weather-icon");
const DateUpdate = document.querySelector(".date");
const forecastItemsContainer = document.querySelector(".forecast");
SearchButton.addEventListener("click", ()=>
{
    if(SearchBar.value.trim() !== '')
    {
        UpdateWeather(SearchBar.value)
        SearchBar.value = ''
        SearchBar.blur()
    };
})
SearchBar.addEventListener("keydown", (event)=>
{
    if(event.key == 'Enter' && SearchBar.value.trim() !== '')
    {
        UpdateWeather(SearchBar.value)
        SearchBar.value = ''
        SearchBar.blur()
    }
})
async function FetchWeatherData(endPoint, city)
{
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${APIKey}&units=metric`
    const response = await fetch(apiURL)
    return response.json();
}
function GetWeatherIcon(id)
{
    if (id <= 232) return `img src="https://cdn3.iconfinder.com/data/icons/weather-16/256/Storm-512.png"`
    if (id <= 321) return 'https://cdn-icons-png.flaticon.com/512/6423/6423427.png'
    if (id <= 531) return 'https://static.vecteezy.com/system/resources/thumbnails/009/585/430/small/rain-drop-from-cartoony-cloud-free-free-png.png'
    if (id <= 622) return 'https://i.pinimg.com/564x/73/d9/94/73d99425905c3718dbf81594e8d5ee7e.jpg'
    if (id <= 800) return 'https://png.pngtree.com/png-clipart/20230813/original/pngtree-vector-illustration-of-weather-icon-sun-with-clear-sky-vector-picture-image_10530522.png'
    else return 'https://cdn4.iconfinder.com/data/icons/weather-129/64/weather-2-512.png'
}
function CurrentDate()
{
    const CurrentDateInfo = new Date();
    const options =
    {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    }
    return CurrentDateInfo.toLocaleDateString('en-GB', options)

}
async function UpdateWeather(city)
{
    const WeatherReport = await FetchWeatherData('weather', city)
    if(WeatherReport.cod !== 200)
    {
        Display(Error)
        return 
    }
    console.log(WeatherReport)
    const 
    {
        name: country,
        main: {temp,humidity},
        weather: [{id,main}],
        wind: {speed}
    }=WeatherReport
    SelectedCity.textContent = country;
    SelectedTemp.textContent = temp + ' °C';
    SelectedHumid.textContent = humidity + ' %';
    SelectedWind.textContent = speed + ' km/h';
    WeatherIcon.src = `${GetWeatherIcon(id)}`;
    DateUpdate.textContent = CurrentDate();
    await updatedForecasts(city);
    Display(WeatherForecast)

}
async function updatedForecasts(city)
{
    const forecast = await FetchWeatherData('forecast', city)
    const initialTime = '12:00:00'
    const recentDate = new Date().toISOString().split('T')[0]
    forecastItemsContainer.innerHTML = ''
    forecast.list.forEach(forecastWeather=>
    {
        if(forecastWeather.dt_txt.includes(initialTime) && !forecastWeather.dt_txt.includes(recentDate))
        {
            updatedForecastItems(forecastWeather)
        }
        
    }
    )
}
function updatedForecastItems(WeatherReport)
{
    console.log(WeatherReport)
    const {dt_txt:date,
        weather:[{id, main}],
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

    const forecastItem = 
        `<div class="forecast-item text-center lg:h-70 border md:h-70 md:w-40 sm:h-70 sm:w-40 sm:gap-1">
        <p class="text-3xl">${dateResult}</p>
        <img src="${GetWeatherIcon(id)}" alt="weather-icon" class="weather-icon h-10 place-self-center">
        <p class="text-3xl">${temp} °C </p>
        <img src="https://static.thenounproject.com/png/2280622-200.png" alt="humidity icon" class="h-10 place-self-center">
        <p class="text-3xl">${humidity} %</p>
        <img src="https://static.thenounproject.com/png/1824196-200.png" alt="windspeed icon" class="h-10 place-self-center">
        <p class="text-3xl">${speed} km/h</p>
      </div>`
      forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}
function Display(section)
{
    [WeatherForecast, SearchCity, Error]
    .forEach(section=>section.style.display = 'none')
    section.style.display = ''
}