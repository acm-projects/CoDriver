<p align="center">

  <img src="https://cdn-cpfgb.nitrocdn.com/dRxFEBZBvMUrSIsoXplluqPbGwZVXSCF/assets/images/optimized/rev-ed01629/dirtfish-editorial.s3-accelerate.amazonaws.com/2021/01/670bbd07-a4a7-4b4a-9743-76425dfe80ca.jpeg" width="700">
</p>

# <h1 align="center">CoDriver 🚗</h1>

## Summary ✨

Long road trips often cause significant fatigue for drivers, making it unsafe for them and other drivers. That’s where CoDriver steps in! It's a mobile app with a conversational AI assistant that feels like having a co-pilot in your passenger seat. Designed to keep you safe, focused, and engaged, CoDriver monitors your behavior and provides real-time feedback to keep you focused while on the road. It also keeps you entertained with engaging conversations and helpful information about your route, making every drive more enjoyable.

## MVP 💡

- User account creation with authentication
- Conversational AI Assistant  
  - Hands-free, should be able to just talk naturally 
  - Real-time conversational ability to keep the driver engaged and awake  
  - Provides helpful interactions to reduce stress or boredom while driving  
  - Ability to give information to the driver conversationally
- Road safety monitoring  
  - Alerts the driver to hazards (crashes, speed traps, and traffic congestion)  
  - Done through the AI Assistant to keep it conversational
- Map integration for directions  
  - Directions completely verbally to help the driver not look at a map 
- Eye detection  
  - Using the front camera to look at drivers’ eyes to determine if they are focused  
  - If they are not focused, prompt the AI to create a conversation to make the driver focused

## Stretch Goals 🎯

- Feedback based on driver expression
- Personalized interactions
- Music integration
- Multiple language support
- Automatic emergency support by voice
- Gamification to promote focused driving

## Milestones 🗓️

<details>
  <summary>Week 1</summary>

- Decide frontend/backend roles and ensure the team understands the overall project  
- Set up communication method (discord/slack) and weekly meeting times (When2Meet)  
- All team members work use Figma to start designing Low Fidelity UI mockups  

**Frontend team:**  
- Look into/watch videos about React Native  
- Continue working on Figma design and color scheme  

**Backend team:**  
- Look into/watch videos about MongoDB, Express, and Node.js (MERN)  
- Play around with the APIs (use Postman)  
- Research LLMs that we could use 
</details>

<details>
  <summary>Week 2</summary>

**Frontend**  
- Go over UI design basics  
- Finish up the Figma Design by the end of this week  

**Backend**  
- Begin setting up user authentication and database schema  
- Create a working prototype for user account creation  
- Keep learning about the MERN stack, APIs, and LLM
</details>

<details>
  <summary>Weeks 3/4</summary>

**Frontend**  
- Start working on the frontend components and core pages  
- Login/Create Account Pages  
- Profile page  
  - User information and stats  
- Settings page  
  - Connect services like Spotify for music  
  - What the AI voice should be like  
  - How often it should interact with you  

**Backend**  
- Create database and APIs for user authentication  
- Set up the APIs real-time hazard alerts and location-based updates  
- Start feeding real-time information into to the LLM and get proper results based on location and hazards  
- Look into Google Directions API for routing functionality
</details>

<details>
  <summary>Weeks 5/6</summary>

**Frontend**  
- Dashboard Page with AI Assistant (main page)  
  - Conversational AI interface  
  - Music player controls  
  - Eye-detection status indicator  
  - Navigational indicator  
  - Alert notifications  
- Integrate hands-free voice controls across all features  
  - Mute the AI assistant  
  - Skip the song

**Backend:**  
- Connect backend the frontend user login and signup page  
- Connect the profile and settings page to update the user’s preferences  
- Finish real-time data integration for traffic, hazards, and weather by the end of week 6  
- Start getting the AI Assistant to be more interactive instead of just spewing information  
- Make sure all APIs and endpoints are done the end of week 6  

Both teams look into eye tracking  
- Needs to start with calibration to be accurate  
- Testing mode for development and presentation  
- Returns information to the backend for AI assistant  

Start to focus on connecting the backend to frontend as a team
</details>

<details>
  <summary>Weeks 7/8: Finishing Touches</summary>

**Frontend**  
- Complete pages and check for bugs throughout the app

**Backend**  
- Connect the backend to the frontend  
- If possible work on more stretch goals  
- MVP app functionality should be done by end of week 8
</details>

<details>
  <summary>Weeks 9/10: Preparations</summary>

- Record demo videos while in car  
- Prep for Presentation Night!  
- Make sure the Slides and Demo are ready and good to go
</details>

## Tech Stack 🛠️

#### React Native
- <a href="https://reactnative.dev/docs/tutorial?language=javascript">Learn the Basics</a>
- <a href="https://reactnative.dev/docs/environment-setup">Setting up the Environment</a>
- <a href="https://www.youtube.com/playlist?list=PLC3y8-rFHvwhiQJD1di4eRVN30WWCXkg1">React Native Playlist</a>
- <a href="https://www.youtube.com/watch?v=mrjy92pW0kM">React Native #1: Setup Visual Studio Code</a>
- <a href="https://www.youtube.com/watch?v=6ZnfsJ6mM5c">React Native Tutorial for Beginners - Getting Started</a>
- Getting the User’s location:
  - <a href="https://www.youtube.com/watch?v=d7G0E_9FwyE">Get Current Location, Geocode and Reverse Geocode in Expo React Native Apps using expo-location</a>
- QR code:
  - <a href="https://www.youtube.com/watch?v=ZAjrx36WJxU">Working with QR Codes and React-Native with Typescript [2022]</a>

#### Android Studio
- <a href="https://www.youtube.com/watch?v=DM783YA0vbc">How to install Android Studio on Windows 10/11 [2023 Update] Flamingo Installation</a>
- <a href="https://www.youtube.com/watch?v=ri90tcQL-Aw">How to Install Android Studio on Mac</a>

#### MERN Stack
- This works really well with React Native and with MongoDB it can handle any form of data without any issue
- MERN Stack Playlist. It goes over how to create user authentication. Hence, I suggest looking at that portion:
  - <a href="https://www.youtube.com/watch?v=P5QbE9aRCLQ&list=PLaAoUJDWH9WrPXMOkqHHsPHxbhvRDqryM">How to Start WIth Node & Express From Zero - Node Authentication API Part-1</a>
- MongoDB Playlist:
  - <a href="https://www.youtube.com/watch?v=ExcRbA7fy_A&list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA">Complete MongoDB Tutorial #1 - What is MongoDB?</a>

#### APIs
- <a href="https://www.youtube.com/watch?v=KJhg761xb3c">Fetching Data from An API in React Native</a>
- <a href="https://rapidapi.com/search/restaurants/">Searching for APIs</a>
- Suggestions:
  - <a href="https://tripadvisor-content-api.readme.io/reference/searchfornearbylocations">Tripadvisor API</a>
  - From Rapid API: <a href="https://rapidapi.com/ptwebsolution/api/restaurants222/">Restaurant API</a>
- <a href="https://www.youtube.com/watch?v=fgTGADljAeg">Build A REST API With Node.js, Express, & MongoDB - Quick</a>

#### LLM
- 5 min vid: <a href="https://www.youtube.com/watch?v=5sLYAQS9sWQ">How Large Language Models Work</a>
- Chatbot Fine Tuning:
  - <a href="https://www.youtube.com/watch?v=eC6Hd1hFvos">Fine-tuning Large Language Models (LLMs) | w/ Example Code</a>
- <a href="https://js.langchain.com/docs/get_started/installation">Langchain</a>
  - <a href="https://www.youtube.com/watch?v=veV2I-NEjaM">Langchain JS | How to Use GPT-3, GPT-4 to Reference your own Data | OpenAI Embeddings Intro</a>
- <a href="https://openai.com/blog/introducing-chatgpt-and-whisper-apis">ChatGPT</a>
  - <a href="https://www.youtube.com/watch?v=1YU83Lw58eo">Write A ChatGPT Chatbot With Node.js</a>

#### Spotify
- Spotify Remote is used to control Spotify through React Native

## Roadblocks and Possible Solutions 🚧

- Real-time latency for directions with an LLM  
  - Feeding the directions into an LLM in real time may cause delay and be inaccurate at some points when driving. Instead, we could just speak the directions outside of the LLM.
- LLM cost  
  - Calling an LLM API like OpenAI multiple times will cost money. In order to have this be free we can use a locally hosted LLM which can also lead to better accuracy.
- The backend team falling behind.  
  - The frontend team can try to help the backend team. This can be a good learning experience for both teams.

## Competition 🏆

- Any maps app (No real time conversation or feedback based on driver)  
- Beep: Drowsiness Detection (Needs an airpod, does not detect lane veering, no conversational feedback)  
- ChatGPT/any LLM (No feedback to driver, or drive detection)

## Other Resources 📚

- Visual Studio Code or Android Studio  
- React Native  
- Node.js  
- GitHub - Docs - Tutorial  
- MongoDB

## Git Commands 📝

| Command                       | What it does                        |
| ----------------------------- | ----------------------------------- |
| git branch                    | lists all the branches              |
| git branch "branch name"      | makes a new branch                  |
| git checkout "branch name"    | switches to speicified branch       |
| git checkout -b "branch name" | combines the previous 2 commands    |
| git add .                     | finds all changed files             |
| git commit -m "Testing123"    | commit with a message               |
| git push origin "branch"      | push to branch                      |
| git pull origin "branch"      | pull updates from a specific branch |

## CoDriver TEAM! 👥

- Anusha Patel
- Kaushik Shivakumar
- Siddhartha Somalinga Kailash
- Sri Satya Sourish Reddy
- 

![image](https://drive.google.com/uc?export=view&id=12CNd-_3LErBp6fDX04N7u4rCT-mkuvI3)
