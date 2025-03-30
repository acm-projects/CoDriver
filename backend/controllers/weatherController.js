const axios = require('axios');
require('dotenv').config();


const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class WeatherController {
    // get city from frontend or maps api
    async getWeather(city) {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
            );

            const weather = response.data;
            console.log(weather.name)
            return {
                success: true,
                data: {
                    city: weather.name,
                    description: weather.weather[0].description,
                    temperature: Math.round(weather.main.temp),
                    feelsLike: Math.round(weather.main.feels_like),
                    humidity: weather.main.humidity,
                    windSpeed: weather.wind.speed
                }
                
            };
        } catch (error) {
            console.error('Error fetching weather:', error);
            return {
                success: false,
                error: 'Unable to fetch weather data'
            };
        }
    }

    // extract city name from user input if user mentions it
    extractCity(input) {
        const cityPatterns = [
            /weather in ([a-zA-Z\s]+)/i,
            /temperature in ([a-zA-Z\s]+)/i,
            /how (?:hot|cold) is it in ([a-zA-Z\s]+)/i,
            /what's the weather like in ([a-zA-Z\s]+)/i
        ];

        for (const pattern of cityPatterns) {
            const match = input.match(pattern);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
        
        return 'Dallas'; // default city
    }

    async formatWeatherResponse(weatherData) {
        if (!weatherData.success) {
            return "I'm sorry, I couldn't fetch the weather information at the moment.";
        }

        const w = weatherData.data;
        return `The current weather in ${w.city} is ${w.description} with a temperature of ${w.temperature}°C. ` +
               `It feels like ${w.feelsLike}°C, with ${w.humidity}% humidity and wind speed of ${w.windSpeed} m/s.`;
    }
}

module.exports = new WeatherController(); 