const { Anthropic } = require('@anthropic-ai/sdk');
const axios = require('axios');
require('dotenv').config();
const user = require('../controller/user');

// Claude configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({
    apiKey: CLAUDE_API_KEY,
});

class AIController {
    constructor() {
        this.lastHazardAnnounced = null;
        this.conversations = {};
        this.sessionHistory = {};
        this.temperature = 0.8; // default temperature
        this.humorLevel = 0.5; // default humor level
        this.frequency = 50; // default frequency
        this.lastUserInteraction = Date.now(); // track last user interaction
        this.autoConversationTimer = null; // timer for automatic conversations
        this.isAutoConversationEnabled = false; // flag to track if auto conversation is enabled
    }



    // new Claude response method
    async getClaudeResponse(userInput, sessionId, context = 'general', weatherData, hazardData) {
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
                temperature: this.temperature,
                system: systemPrompt,
                messages: this.sessionHistory[sessionId]
            });

            const aiResponse = response.content[0].text;

            this.sessionHistory[sessionId].push({ role: "assistant", content: aiResponse }); // Save response

            // handle music commands
            const musicCommands = {
                'MUSIC_PLAY': { endpoint: '/api/music/play', action: 'Playing music' },
                'MUSIC_PAUSE': { endpoint: '/api/music/pause', action: 'Pausing music' },
                'MUSIC_NEXT': { endpoint: '/api/music/next', action: 'Skipping to next track' },
                'MUSIC_PREVIOUS': { endpoint: '/api/music/previous', action: 'Going to previous track' }
            };

            for (const [command, details] of Object.entries(musicCommands)) {
                if (aiResponse.includes(command)) {
                    try {
                        await axios.post(`http://172.20.10.4:8000${details.endpoint}`);
                        return details.action;
                    } catch (error) {
                        console.error('Error executing music command:', error);
                        return "Sorry, I couldn't control the music right now.";
                    }
                }
            }
            console.log("temperature for this response: ", this.temperature);
            return aiResponse;

        } catch (error) {
            console.error('Error fetching response from Claude:', error);
            return "Sorry, I couldn't process that right now.";
        }
    }

    getSystemPrompt(context, weatherData, hazardData) {
        // define humor prompts for different levels
        const humorPrompts = {
            0: "You are a serious driving companion. Keep all responses extremely brief (maximum 1-2 short sentences). Be concise. You are serious and do not tell jokes.",
            0.25: "You are a slightly friendly driving companion. Keep responses brief and occasionally light-hearted, but avoid telling jokes.",
            0.5: "You are a friendly driving companion who tells jokes. Keep jokes extremely short and road-appropriate. One-liners are preferred. Make jokes about cars, vehicles, or interesting driving facts.",
            0.75: "You are a very friendly and humorous driving companion. Tell short, road-appropriate jokes frequently. One-liners are preferred. Make jokes about cars, vehicles, or interesting driving facts.",
            1: "You are a friendly and extremely funny driving companion who tells jokes. Keep jokes extremely short and road-appropriate. One-liners are preferred. Make jokes about cars, vehicles, or interesting driving facts."
        };

        // function to get the appropriate humor prompt based on the humor level
        const getHumorPrompt = (level) => {
            // if the exact level exists in humorPrompts, use it
            if (humorPrompts[level]) {
                return humorPrompts[level];
            }
            
            // otherwise, interpolate between the closest defined levels
            const levels = Object.keys(humorPrompts).map(Number).sort((a, b) => a - b);
            
            // find the closest lower and higher levels
            let lowerLevel = 0;
            let higherLevel = 1;
            
            for (let i = 0; i < levels.length; i++) {
                if (levels[i] <= level) {
                    lowerLevel = levels[i];
                }
                if (levels[i] >= level) {
                    higherLevel = levels[i];
                    break;
                }
            }
            
            // if we're at an extreme, just use that prompt
            if (lowerLevel === higherLevel) {
                return humorPrompts[lowerLevel];
            }
            
            // interpolate between the two prompts
            const ratio = (level - lowerLevel) / (higherLevel - lowerLevel);
            
            // for simplicity, we'll just use the higher level prompt if we're closer to it
            if (ratio > 0.5) {
                return humorPrompts[higherLevel];
            } else {
                return humorPrompts[lowerLevel];
            }
        };
   
        const systemPrompts = {
            general: `You are a friendly driving companion. Keep all responses extremely brief (maximum 1-2 short sentences). Be concise but friendly.
                     Recognize if the user wants to control music (play music, pause, skip, previous) and respond ONLY with one of these exact commands:
                     MUSIC_PLAY
                     MUSIC_PAUSE
                     MUSIC_NEXT
                     MUSIC_PREVIOUS
                     If the user is tired, offer to play a game or tell a joke.` + getHumorPrompt(this.humorLevel),
            
            weather: this.buildWeatherPrompt(weatherData), 
            
            hazard: this.buildHazardPrompt(hazardData),
            
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
        console.log('Weather data:', w);
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
        // update the last user interaction time
        this.updateLastUserInteraction();
        
        const input = userInput.toLowerCase();
        
        // if there's hazard data, prioritize announcing it
        if (hazardData) {
            return this.getClaudeResponse(userInput, sessionId, 'hazard', null, hazardData);
        }

        // rest of the existing context detection for jokes, word games, trivia, etc.
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

        // default to general AI response for everything else
        return this.getClaudeResponse(userInput, sessionId, 'general');
    }

    // new method to change the temperature of the ai
    async changeTemperature(temperature) {
        try {
            if (temperature < 0 || temperature > 1) {
                throw new Error('Temperature must be between 0 and 1');
            }
            console.log('Changing temperature to:', temperature);
            this.temperature = temperature;
        } catch (error) {
            console.error('Error changing temperature:', error);
        }
    }

    async changeHumorLevel(humorLevel) {
        try {
            if (humorLevel < 0 || humorLevel > 1) {
                throw new Error('Humor level must be between 0 and 1');
            }
            console.log('Changing humor level to:', humorLevel);
            this.humorLevel = humorLevel;
            
            // log the current humor prompt for debugging
            const humorPrompts = {
                0: "Serious",
                0.25: "Slightly friendly",
                0.5: "Friendly",
                0.75: "Very friendly",
                1: "Extremely funny"
            };
            
            // find the closest defined level
            const levels = Object.keys(humorPrompts).map(Number).sort((a, b) => a - b);
            let closestLevel = 0;
            let minDiff = 1;
            
            for (const level of levels) {
                const diff = Math.abs(level - humorLevel);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestLevel = level;
                }
            }
            
            console.log(`Humor style: ${humorPrompts[closestLevel]}`);
            
            return { success: true, humorLevel: this.humorLevel, style: humorPrompts[closestLevel] };
        } catch (error) {
            console.error('Error changing humor level:', error);
            return { success: false, error: error.message };
        }
    }


    // the frequency maps to the seconds or minutes until the bot starts yapping
    async changeBotFrequency(frequency) {
        try {
            if (frequency < 0 || frequency > 1) {
                throw new Error('Frequency must be between 0 and 1');
            }
            console.log('Changing bot frequency to:', frequency);
            this.frequency = frequency;
            
            // clear any existing timer
            if (this.autoConversationTimer) {
                clearInterval(this.autoConversationTimer);
                this.autoConversationTimer = null;
            }
            
            // if frequency is 0, disable auto conversation
            if (frequency === 0) {
                this.isAutoConversationEnabled = false;
                console.log('Auto conversation disabled');
                return;
            }
            
            // enable auto conversation
            this.isAutoConversationEnabled = true;
            
            // convert frequency to milliseconds (frequency is 0-1, map to 30-300 seconds)
            const minInterval = 30000; // 30 seconds minimum
            const maxInterval = 300000; // 300 seconds (5 minutes) maximum
            const intervalMs = minInterval + (frequency * (maxInterval - minInterval));
            
            console.log(`Bot will start yapping every ${intervalMs/1000} seconds.`);
            
            // set up the timer to check for silence and start conversations
            this.autoConversationTimer = setInterval(() => {
                this.checkForSilenceAndStartConversation();
            }, intervalMs);
            
        } catch (error) {
            console.error('Error changing bot frequency:', error);
        }
    }
    
    // method to check for silence and start a conversation if needed
    async checkForSilenceAndStartConversation() {
        if (!this.isAutoConversationEnabled) return;
        
        const currentTime = Date.now();
        const silenceDuration = currentTime - this.lastUserInteraction;
        
        // ff there's been no user interaction for the specified interval, start a conversation
        if (silenceDuration > 30000) { // At least 30 seconds of silence
            console.log('Starting automatic conversation after silence');
            await this.startAutomaticConversation();
        }
    }
    
    // method to start an automatic conversation
    async startAutomaticConversation() {
        try {
            // generate a random conversation starter
            const conversationStarter = this.generateConversationStarter();
            
            // use the /command route to process the conversation starter
            const response = await axios.post('http://172.20.10.4:8000/command', {
                userInput: conversationStarter,
                sessionId: 'auto'
            });
            
            console.log('Automatic conversation started:', response.data);
            
            // update the last interaction time to prevent immediate follow-up
            this.lastUserInteraction = Date.now();
            
            return response.data;
        } catch (error) {
            console.error('Error starting automatic conversation:', error);
        }
    }
    
    // method to generate random conversation starters
    generateConversationStarter() {
        const starters = [
            "Start a conversation with the user",
        ];
        
        // select a random starter based on humor level
        const index = Math.floor(Math.random() * starters.length);
        return starters[index];
    }
    
    // method to update the last user interaction time
    updateLastUserInteraction() {
        this.lastUserInteraction = Date.now();
    }

    // new method to format navigation instruction
    async formatNavigationInstruction(instruction) {
        try {
            console.log('Formatting navigation instruction:', instruction.instruction);
            const userInput = `Convert this navigation instruction to a more conversational format. Include any distance or duration information naturally:
                             Original instruction: ${instruction.instruction}
                             Distance: ${instruction.distance}
                             Duration: ${instruction.duration}
                             Maneuver: ${instruction.maneuver || 'none'}
                             Examples:
                            - Instead of "Turn right on Main Street", say "Hey, you'll want to turn right on Main Street up ahead"
                            - Instead of "In 100 meters, turn left", say "Coming up soon, you'll need to make a left turn
                            Convert Dr. to drive, St. to street, Ave. to avenue, Rd. to road, Blvd. to boulevard, Ct. to court, Ln. to lane, Pl. to place, pkwy to parkway and Ter. to terrace."`;
            
            const formattedInstruction = await this.getClaudeResponse(userInput, 'navigation', 'navigation');
            
            return {
                ...instruction,
                instruction: formattedInstruction,
                originalInstruction: instruction.instruction // keep the original instruction for reference
            };
        } catch (error) {
            console.error('Error formatting navigation instruction:', error);
            return instruction; // return original instruction if formatting fails
        }
    }
}

module.exports = new AIController();