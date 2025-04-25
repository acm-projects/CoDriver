const axios = require('axios');
const AIController = require('./aiController');
const WeatherController = require('./weatherController');

class CommandController {
    async processCommand(userInput, sessionId, city) {
        const input = userInput.toLowerCase();
        
        // Weather command triggers 
        const weatherTriggers = [
            'weather', 'temperature', 'how hot', 'how cold'
        ];

        if (weatherTriggers.some(trigger => input.includes(trigger))) {
            try {
                // Use city parameter if provided, otherwise extract from input
                const locationCity = city || this.extractCity(userInput);
                const weatherData = await WeatherController.getWeather(locationCity);
                
                
                // new Claude call (sm better omg)
                const aiResponse = await AIController.getClaudeResponse(
                    userInput,
                    sessionId,
                    'weather',
                    weatherData
                );

                return {
                    message: 'Weather Information',
                    response: aiResponse
                };
            } catch (error) {
                console.error('Error processing weather command:', error);
                return { error: 'Failed to fetch weather information' };
            }
        }

        // Music commands
        const musicCommands = {
            'play music': { play: true },
            'pause music': { pause: true },
            'next song': { next: true },
            'skip song': { next: true },
            'previous song': { previous: true },
            'play next': { next: true },
            'play previous': { previous: true },
            // Shorter commands commented out as in the second file
            // 'pause': { pause: true },
            // 'next': { next: true },
            // 'skip': { skip: true },
            // 'previous': { previous: true },
            // 'back': { previous: true }
        };

        // Check for music commands first
        for (const [command, action] of Object.entries(musicCommands)) {
            if (input.includes(command)) {
                console.log("recognized a music command (not ai)");
                return await this.musicCommand({ music: action });
            }
        }

        // Entertainment commands
        const entertainmentTriggers = {
            jokes: ['tell me a joke', 'make me laugh', 'know any jokes'],
            games: ["let's play a game", 'play word game', 'i spy', '20 questions'],
            trivia: ["let's play trivia", 'quiz me', 'test my knowledge']
        };

        // Check if input matches any entertainment command
        for (const [category, triggers] of Object.entries(entertainmentTriggers)) {
            if (triggers.some(trigger => input.includes(trigger))) {
                const aiResponse = await AIController.handleUserInput(userInput, sessionId);
                return {
                    message: `${category.charAt(0).toUpperCase() + category.slice(1)} Response`,
                    response: aiResponse
                };
            }
        }

        // If no specific command matched, pass to AI for general conversation
        try {
            const aiResponse = await AIController.handleUserInput(userInput, sessionId);
            console.log("ai response received " + aiResponse);
            return {
                message: 'AI Response',
                response: aiResponse
            };
        } catch (error) {
            console.error('Error processing command:', error);
            return { error: 'Failed to process command' };
        }
    }

    async musicCommand({ music }) {
        try {
            if (!music) return null;
            console.log("music command received");
            // Keyword was recognized and is now matched to route
            if ('play' in music) {
                const response = await axios.post('http://10.0.0.215:8000/api/music/play');
                return response.data;
            } else if ('pause' in music) {
                const response = await axios.post('http://10.0.0.215:8000/api/music/pause');
                return response.data;
            } else if ('next' in music) {
                const response = await axios.post('http://10.0.0.215:8000/api/music/next');
                return response.data;
            } else if ('previous' in music) {
                const response = await axios.post('http://10.0.0.215:8000/api/music/previous');
                return response.data;
            }
            
            return { error: 'Unknown music command' };
        } catch (error) {
            console.error('Error processing music command:', error);
            return { error: 'Failed to process music command' };
        }
    }

    // Function to extract city from user input
    extractCity(userInput) {
        // Regex pattern to match "weather in [city]" or similar variations
        const cityRegex = /weather\s+in\s+([a-zA-Z\s]+)/i;
        const match = userInput.match(cityRegex);
        if (match && match[1]) {
            return match[1].trim(); // Return the city part of the input
        }
        return 'Dallas';  // Default to Dallas if no city is found
    }
}

module.exports = new CommandController();