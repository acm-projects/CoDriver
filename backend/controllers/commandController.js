const axios = require('axios');
const AIController = require('./aiController');
const WeatherController = require('./weatherController');

class CommandController {
    async processCommand(userInput, sessionId, city) {
        const input = userInput.toLowerCase();
        
        // some weather command triggers 
        const weatherTriggers = [
            'weather', 'temperature', 'how hot', 'how cold'
        ];

        if (weatherTriggers.some(trigger => input.includes(trigger))) {
            try {
                //const city = WeatherController.extractCity(userInput);
                const weatherData = await WeatherController.getWeather(city);
                
                
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

        // check if it's a music command 
        const musicCommands = {
            'play music': { play: true },
            'pause music': { pause: true },
            'next song': { next: true },
            'skip song': { next: true },
            'previous song': { previous: true },
            'play next': { next: true },
            'play previous': { previous: true },
            // 'pause': { pause: true },
            // 'next': { next: true },
            // 'skip': { skip: true },
            // 'previous': { previous: true },
            // 'back': { previous: true }
        };

        // check for music commands first
        for (const [command, action] of Object.entries(musicCommands)) {
            
            if (input.includes(command)) {
                console.log("recognized a music command (not ai)");
                return await this.musicCommand({ music: action });
            }
        }

        // entertainment commands
        const entertainmentTriggers = {
            jokes: ['tell me a joke', 'make me laugh', 'know any jokes'],
            games: ["let's play a game', 'play word game', 'i spy', '20 questions"],
            trivia: ["let's play trivia', 'quiz me', 'test my knowledge"]
        };

        // check if input matches any entertainment command
        for (const [category, triggers] of Object.entries(entertainmentTriggers)) {
            if (triggers.some(trigger => input.includes(trigger))) {
                const aiResponse = await AIController.handleUserInput(userInput, sessionId);
                return {
                    message: `${category.charAt(0).toUpperCase() + category.slice(1)} Response`,
                    response: aiResponse
                };
            }
        }

        // if no specific command matched, pass to AI for general conversation
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
            // keyword was recognized and is now matched to route
            if ('play' in music) {
                const response = await axios.post('http://localhost:3000/api/music/play');
                return response.data;
            } else if ('pause' in music) {
                const response = await axios.post('http://localhost:3000/api/music/pause');
                return response.data;
            } else if ('next' in music) {
                const response = await axios.post('http://localhost:3000/api/music/next');
                return response.data;
            } else if ('previous' in music) {
                const response = await axios.post('http://localhost:3000/api/music/previous');
                return response.data;
            }
            
            return { error: 'Unknown music command' };
        } catch (error) {
            console.error('Error processing music command:', error);
            return { error: 'Failed to process music command' };
        }
    }
}

module.exports = new CommandController();