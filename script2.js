let apiKey='7731a1e5be0459ca3e196363e9ab0fa5';

let lat=document.getElementById("lat");
let long=document.getElementById("long");
let map=document.getElementById("map");
let iframe=document.getElementById("iframe");

async function fetchGeolocation() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
    //   map.innerHTML =`<iframe src="https://maps.google.com/maps?q=17.190145,73.8567437 &z=15&output=embed" width="100%" height="400px" frameborder="0" style="border:0"></iframe>`
       iframe.src=`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
      return { latitude, longitude };
    } catch (error) {
      console.error('Geolocation error:', error.message);
      throw error;
    }
  }

async function fetchWeatherData(latitude, longitude) {
    // api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=4feea3b45dca4a4470187b16bd5186f0

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=7731a1e5be0459ca3e196363e9ab0fa5&units=metric`;

    try {
      const response = await fetch(apiUrl);
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch weather data');
    //   }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Weather data fetching error:', error.message);
      throw error;
    }
  }  
  function degreeToDirection(degree) {
    if (degree >= 337.5 || degree < 22.5) {
      return "North";
    } else if (degree >= 22.5 && degree < 67.5) {
      return "North East";
    } else if (degree >= 67.5 && degree < 112.5) {
      return "East";
    } else if (degree >= 112.5 && degree < 157.5) {
      return "South East";
    } else if (degree >= 157.5 && degree < 202.5) {
      return "South";
    } else if (degree >= 202.5 && degree < 247.5) {
      return "South West";
    } else if (degree >= 247.5 && degree < 292.5) {
      return "West";
    } else {
      return "North West";
    }
  }


  function secondsToTimeZoneString(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const sign = hours >= 0 ? '+' : '-';
    console.log({sign, hours: Math.abs(hours), minutes, seconds: remainingSeconds });
    return {sign, hours: Math.abs(hours), minutes, seconds: remainingSeconds };
  }

async function fetchDataAndDisplay() {
    try {
      const { latitude, longitude } = await fetchGeolocation();
      lat.innerText=`Lat : ${latitude}`
      long.innerText=`Long : ${longitude}`
    //   await initMap(latitude,longitude);
      
      const weatherData = await fetchWeatherData(latitude, longitude);
      console.log(weatherData);
      let time=secondsToTimeZoneString(weatherData.timezone);
      const temp = Math.round(weatherData.main.temp );
      document.getElementById("location").innerText=`Location: ${weatherData.name}`;
      document.getElementById("windspped").innerText=`Wind Speed: ${Math.round(weatherData.wind.speed*3.6)}km/hr`
      document.getElementById("Humidity").innerText=`Humidity: ${weatherData.main.humidity}`;
      document.getElementById("Humidity").innerText=`Humidity: ${weatherData.main.humidity}`;
      document.getElementById("Timezone").innerHTML=`<span>Time Zone : GMT ${time.sign}${time.hours}:${time.minutes}</span>`
      document.getElementById("pressure").innerText=`pressure: ${weatherData.main.pressure}atm`;
      document.getElementById("winddirection").innerText=`Wind Direction: ${degreeToDirection(weatherData.wind.deg)}`;
      document.getElementById("Uvindex").innerText=`Uvindex: 500 atm`;
      document.getElementById("FeelsLike").innerText=`FeelsLike: ${temp} degree`;

    } catch (error) {
      console.error('Error:', error.message);
    }
  }
fetchDataAndDisplay();