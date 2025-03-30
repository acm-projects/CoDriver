const { Anthropic } = require('@anthropic-ai/sdk');
const axios = require('axios');
require('dotenv').config();


// new and hopefully better Claude configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({
    apiKey: CLAUDE_API_KEY,
});

class AIController {
    constructor() {
        this.lastHazardAnnounced = null;
        this.conversations = {};
        this.sessionHistory = {};
    }


    // new Claude response method
    async getClaudeResponse(userInput, sessionId, context = 'general', weatherData = null, hazardData = null) {
        try {

            if (!sessionId) {
                console.warn("Warning: sessionId is missing. Using default session.");
                sessionId = 'default'; // fallback to a default session
            }

            // retrieve or initialize message history for sessionId
            if (!this.sessionHistory) {
                this.sessionHistory = {}; // ensure session storage exists
            }

            if (!this.sessionHistory[sessionId]) {
                this.sessionHistory[sessionId] = []; // initialize array for this session
            }

            const systemPrompt = this.getSystemPrompt(context, weatherData, hazardData);
            

            // append user input
            this.sessionHistory[sessionId].push({ role: "user", content: userInput });

            // limit message history (keep last 10 messages to avoid hitting token limits)
            const historyLimit = 3;
            if (this.sessionHistory[sessionId].length > historyLimit) {
                this.sessionHistory[sessionId] = this.sessionHistory[sessionId].slice(-historyLimit);
            }

            const response = await anthropic.messages.create({
                model: 'claude-3-7-sonnet-20250219',
                max_tokens: 50,
                temperature: 0.8,
                system: systemPrompt,
                // messages: [
                //     {
                //         role: 'user',
                //         content: this.sessionHistory[sessionId] // Pass the entire message history for deepseek
                //     }
                // ]
                messages: this.sessionHistory[sessionId]
            });

            
            const aiResponse = response.content[0].text;

            this.sessionHistory[sessionId].push({ role: "assistant", content: aiResponse }); // Save response


            // handle music commands (existing code)
            const musicCommands = {
                'MUSIC_PLAY': { endpoint: '/api/music/play', action: 'Playing music' },
                'MUSIC_PAUSE': { endpoint: '/api/music/pause', action: 'Pausing music' },
                'MUSIC_NEXT': { endpoint: '/api/music/next', action: 'Skipping to next track' },
                'MUSIC_PREVIOUS': { endpoint: '/api/music/previous', action: 'Going to previous track' }
            };

            for (const [command, details] of Object.entries(musicCommands)) {
                if (aiResponse.includes(command)) {
                    try {
                        await axios.post(`http://localhost:3000${details.endpoint}`);
                        return details.action;
                    } catch (error) {
                        console.error('Error executing music command:', error);
                        return "Sorry, I couldn't control the music right now.";
                    }
                }
            }

            return aiResponse;

        } catch (error) {
            console.error('Error fetching response from Claude:', error);
            return "Sorry, I couldn't process that right now.";
        }
    }

    getSystemPrompt(context, weatherData, hazardData) {
        const systemPrompts = {
            general: `You are a friendly driving companion. Keep all responses extremely brief (maximum 1-2 short sentences). Be concise but friendly.
                     Recognize if the user wants to control music (play music, pause, skip, previous) and respond ONLY with one of these exact commands:
                     MUSIC_PLAY
                     MUSIC_PAUSE
                     MUSIC_NEXT
                     MUSIC_PREVIOUS
                     If the user is tired, offer to play a game or tell a joke.`,
            
            weather: this.buildWeatherPrompt(weatherData), 
            
            hazard: this.buildHazardPrompt(hazardData),
            
            // navigation: `You are a friendly passenger giving navigation instructions. Make the instructions sound natural and conversational.
            //             Convert the given navigation instruction into a more human-like format.
            //             Keep the instruction clear and concise (maximum 1-2 sentences).
            //             Make it sound like a friend giving directions from the passenger seat.
            //             Examples:
            //             - Instead of "Turn right on Main Street", say "Hey, you'll want to turn right on Main Street up ahead"
            //             - Instead of "In 100 meters, turn left", say "Coming up soon, you'll need to make a left turn"
            //             - Instead of "Make a U-turn", say "You'll need to make a U-turn at the next opportunity"
            //             - Instead of "Continue straight", say "Just keep going straight ahead"
            //             - Instead of "Merge onto highway", say "You'll need to merge onto the highway coming up"
            //             Include any distance or duration information naturally in the sentence.
            //             If there's a specific maneuver, make it sound more natural and friendly.
            //             If the instruction includes a street name, mention it naturally in the sentence.`,
            
            jokes: "You are a friendly driving companion who tells jokes. Keep jokes extremely short and road-appropriate. One-liners are preferred. Make jokes about cars, vehicles, or interesting driving facts.",
            
            wordGames: "You are hosting a quick word game while driving. Keep it extremely simple and brief (1-2 sentences max). Focus on simple games like 'I Spy' or quick word associations.",
            
            trivia: "You are hosting a casual trivia game. Ask only one short question at a time. Keep both questions and answers extremely brief (1-2 sentences max). Keep playing the game until the user says stop or indicates they want to do something else."
        };
        return systemPrompts[context] || systemPrompts.general;
    }

    buildWeatherPrompt(weatherData) {
        if (!weatherData || !weatherData.success) {
            return "You are a helpful assistant providing weather information. Keep response under 20 words. If weather data is unavailable, simply apologize and offer to check again.";
        }

        const w = weatherData.data;
        return `You are a helpful assistant providing weather information. 
                Current conditions in ${w.city}: ${w.description}, ${w.temperature}°C, feels like ${w.feelsLike}°C, 
                humidity ${w.humidity}%, wind speed ${w.windSpeed} m/s. 
                IMPORTANT: Provide this information in a very brief, conversational way (maximum 30 words).
                Include only the most relevant safety tip if needed.
                Focus on the most important details only. Say this information conversationally and keep in mind the user is driving.`;
    }

    buildHazardPrompt(hazardData) {
        if (!hazardData || !hazardData.type) {
            return "You are a helpful driving companion. If asked about hazards, explain that you're monitoring the road conditions.";
        }

        // don't announce the same hazard twice in a row
        const hazardKey = `${hazardData.type}-${hazardData.location.lat}-${hazardData.location.lng}`;
        if (this.lastHazardAnnounced === hazardKey) {
            return "You are a helpful driving companion. Acknowledge that you're still monitoring the previous hazard.";
        }
        this.lastHazardAnnounced = hazardKey;

        return `You are a helpful driving companion alerting about a road hazard.
                Current hazard: ${hazardData.type} - ${hazardData.description}
                Distance: ${Math.round(hazardData.distance)} meters ahead
                Severity: ${hazardData.severity || 'Moderate'}
                IMPORTANT: Announce this hazard in a calm, clear, and conversational way.
                Focus on safety and practical advice.
                Example: "Heads up, there's construction work about 500 meters ahead. Let's slow down a bit."`;
    }

    async handleUserInput(userInput, sessionId, hazardData) {
        const input = userInput.toLowerCase();
        
        // if there's hazard data, prioritize announcing it
        if (hazardData) {
            return this.getClaudeResponse(userInput, sessionId, 'hazard', null, hazardData);
        }

        // rest of the existing context detection
        if (input.includes('joke') || input.includes('funny') || input.includes('make me laugh')) {
            return this.getClaudeResponse(userInput, sessionId, 'jokes');
        }
        
        if (input.includes('play a game') || input.includes('word game') || 
            input.includes('i spy') || input.includes('20 questions')) {
            return this.getClaudeResponse(userInput, sessionId, 'wordGames');
        }
        
        if (input.includes('trivia') || input.includes('quiz') || 
            input.includes('test my knowledge')) {
            return this.getClaudeResponse(userInput, sessionId, 'trivia');
        }
        
        return this.getClaudeResponse(userInput, sessionId, 'general');
    }

    // new method to format navigation instruction
    async formatNavigationInstruction(instruction) {
        try {
            // create a more detailed prompt for the AI

            console.log('TRYING TO Formatting navigation instruction:', instruction.instruction);
            const userInput = `Convert this navigation instruction to a more conversational format. Include any distance or duration information naturally:
                             Original instruction: ${instruction.instruction}
                             Distance: ${instruction.distance}
                             Duration: ${instruction.duration}
                             Maneuver: ${instruction.maneuver || 'none'}
                             Examples:
                            - Instead of "Turn right on Main Street", say "Hey, you'll want to turn right on Main Street up ahead"
                            - Instead of "In 100 meters, turn left", say "Coming up soon, you'll need to make a left turn"`;
            
            const formattedInstruction = await this.getClaudeResponse(userInput, 'navigation', 'navigation');
            
            return {
                ...instruction,
                instruction: formattedInstruction,
                originalInstruction: instruction.instruction // i'm going to leave the original instruction for reference and if something goes wrong
            };
        } catch (error) {
            console.error('Error formatting navigation instruction:', error);
            return instruction; // return original instruction if formatting fails
        }
    }
}

module.exports = new AIController();


// the postman input as a json to http://localhost:3000/conversation or /command
// {
//     "userInput": "Lets play a game"
  
//   }