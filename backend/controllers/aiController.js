const axios = require('axios');
require('dotenv').config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // check

class AIController {
  // function to get a generic response from DeepSeek- follows openai format
  async getDeepSeekResponse(userInput) {
    try {
      const systemPrompt = "You are a friendly driving companion, focused on keeping the driver alert and engaged during their journey. Keep responses brief (1-2 sentences) and conversational. Ask follow-up questions about their drive, traffic conditions, or destination. Avoid complex topics that might distract from driving. If the driver seems tired or stressed, suggest taking a break.";
      
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userInput }
          ],
          max_tokens: 100,
          temperature: 0.8, // how creative the AI can be
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content.trim(); 
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching response from DeepSeek:', error.response?.data || error.message);
      return "I'm here to keep you company on the road. How about we chat about something else?";
    }
  }

  // function to handle user input and return generated response
  async handleUserInput(userInput) {
    return this.getDeepSeekResponse(userInput);
  }
}

module.exports = new AIController();


// the postman input as a json to http://localhost:3000/conversation
// {
//     "userInput": "Lets play a game"
  
//   }