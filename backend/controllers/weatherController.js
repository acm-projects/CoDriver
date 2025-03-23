const axios = require('axios');
require('dotenv').config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class WeatherController {
    // get weather data based on city
    async getWeather(city = 'Dallas') {
        console.log(`Fetching weather data for city: ${city}`);

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
            );

            const weather = response.data;
            console.log(`Weather data received for ${weather.name}:`, weather);

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
            console.error('Error fetching weather:', error.response ? error.response.data : error.message);
            return {
                success: false,
                error: 'Unable to fetch weather data'
            };
        }
    }

    // helper method to format the weather data response
    async formatWeatherResponse(weatherData) {
        if (!weatherData.success) {
            console.log("Weather data fetch failed, returning error message.");
            return "I'm sorry, I couldn't fetch the weather information at the moment.";
        }

        const w = weatherData.data;
        console.log(`Formatted weather response: ${w.city} - ${w.description} with temperature ${w.temperature}°C`);

        return `The current weather in ${w.city} is ${w.description} with a temperature of ${w.temperature}°C. ` +
               `It feels like ${w.feelsLike}°C, with ${w.humidity}% humidity and wind speed of ${w.windSpeed} m/s.`;
    }
}

module.exports = new WeatherController();
