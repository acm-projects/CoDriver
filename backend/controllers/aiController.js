const { Anthropic } = require('@anthropic-ai/sdk');
const axios = require('axios');
require('dotenv').config();

// Old DeepSeek configuration
const DEEPSEEK_API_KEY = process.env.CODRIVER1_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// New Claude configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({
    apiKey: CLAUDE_API_KEY,
});

class AIController {
    constructor() {
        this.lastHazardAnnounced = null;
    }

    // // Old DeepSeek response method
    // async getDeepSeekResponse(userInput, context = 'general', weatherData = null) {
    //     try {
    //         const systemPrompts = {
    //             general: "You are a friendly driving companion...",
    //             //weather: this.buildWeatherPrompt(weatherData),
    //             jokes: "You are a friendly driving companion who loves telling jokes...",
    //             wordGames: "You are hosting a fun word game...",
    //             trivia: "You are hosting a casual trivia game..."
    //         };
    
    //         const messages = [
    //             { role: "system", content: systemPrompts[context] },
    //             { role: "user", content: userInput }
    //         ];
    
            // if (weatherData) {
            //     messages.push({
            //         role: "system",
            //         content: `Current weather context: ${JSON.stringify(weatherData.data)}`
            //     });
            // }
    
    //         const response = await axios.post(
    //             DEEPSEEK_API_URL,
    //             {
    //                 model: "deepseek-chat",
    //                 messages: messages,
    //                 max_tokens: 150,
    //                 temperature: 0.8,
    //             },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );
    
    //         return response.data.choices[0].message.content.trim();
    //     } catch (error) {
    //         console.error('Error:', error);
    //         return "I'm sorry, I couldn't process that request right now.";
    //     }
    // }

    // new Claude response method
    async getClaudeResponse(userInput, context = 'general', weatherData = null, hazardData = null) {
        try {
            const systemPrompts = {
                general: `You are a friendly driving companion. Keep all responses extremely brief (maximum 1-2 short sentences). Be concise but friendly.
                         Recognize if the user wants to control music (play, pause, skip, previous) and respond ONLY with one of these exact commands:
                         MUSIC_PLAY
                         MUSIC_PAUSE
                         MUSIC_NEXT
                         MUSIC_PREVIOUS
                         If the user is tired, offer to play a game or tell a joke.`,
                
                weather: this.buildWeatherPrompt(weatherData), 
                
                hazard: this.buildHazardPrompt(hazardData),
                
                jokes: "You are a friendly driving companion who tells jokes. Keep jokes extremely short and road-appropriate. One-liners are preferred.",
                
                wordGames: "You are hosting a quick word game while driving. Keep it extremely simple and brief (1-2 sentences max). Focus on simple games like 'I Spy' or quick word associations.",
                
                trivia: "You are hosting a casual trivia game. Ask only one short question at a time. Keep both questions and answers extremely brief (1-2 sentences max)."
            };

            let messages = `${systemPrompts[context]}\nIMPORTANT: Keep your response under 30 words. For music controls, use ONLY the exact MUSIC_ commands.\n\nHuman: ${userInput}\n\nAssistant:`;
            
            if (weatherData) {
                messages = `${systemPrompts[context]}\nCurrent weather context: ${JSON.stringify(weatherData.data)}\nIMPORTANT: Keep your response under 30 words.\n\nHuman: ${userInput}\n\nAssistant:`;
            }

            if (hazardData) {
                messages = `${systemPrompts['hazard']}\nIMPORTANT: Keep your response under 30 words and focus on the hazard information.\n\nHuman: ${userInput}\n\nAssistant:`;
            }

            const response = await anthropic.messages.create({
                model: 'claude-3-7-sonnet-20250219',
                max_tokens: 50,
                temperature: 0.8,
                messages: [
                    {
                        role: 'user',
                        content: messages
                    }
                ]
            });

            const aiResponse = response.content[0].text;

            // Handle music commands (existing code)
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

        // Don't announce the same hazard twice in a row
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

    async handleUserInput(userInput, hazardData = null) {
        const input = userInput.toLowerCase();
        
        // If there's hazard data, prioritize announcing it
        if (hazardData) {
            return this.getClaudeResponse(userInput, 'hazard', null, hazardData);
        }

        // Rest of the existing context detection
        if (input.includes('joke') || input.includes('funny') || input.includes('make me laugh')) {
            return this.getClaudeResponse(userInput, 'jokes');
        }
        
        if (input.includes('play a game') || input.includes('word game') || 
            input.includes('i spy') || input.includes('20 questions')) {
            return this.getClaudeResponse(userInput, 'wordGames');
        }
        
        if (input.includes('trivia') || input.includes('quiz') || 
            input.includes('test my knowledge')) {
            return this.getClaudeResponse(userInput, 'trivia');
        }
        
        return this.getClaudeResponse(userInput, 'general');
    }
}

module.exports = new AIController();


// the postman input as a json to http://localhost:3000/conversation or /command
// {
//     "userInput": "Lets play a game"
  
//   }