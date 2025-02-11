<p align="center">
<img src='https://www.sbmarketingtools.com/wp-content/uploads/2020/02/How-to-Open-Restaurant.jpg' width='700'>
</p>

# <h1 align="center">CoDriver</h1>

<p align="center">
Long road trips often cause significant fatigue for drivers, making it unsafe for them and other drivers. That’s where CoDriver steps in! It's a mobile app with a conversational AI assistant that feels like having a co-pilot in your passenger seat. Designed to keep you safe, focused, and engaged, CoDriver monitors your behavior and provides real-time feedback to keep you focused while on the road. It also keeps you entertained with engaging conversations and helpful information about your route, making every drive more enjoyable.
</p>
<br>

## MVP :trophy:

- User account with secure authentication
- Conversational AI Assistant
  - Hands-free, should be able to just talk naturally 
  - Real-time conversational ability to keep the driver engaged and awake
  - Provides helpful interactions to reduce stress or boredom while driving
- Road safety monitoring
  - Alerts the driver to hazards (crashes, speed traps, and traffic congestion) 
  - Done through the AI Assistant to keep it conversational
- Map integration for directions
  - Directions completely verbally to help the driver not look at a map
- Eye detection
  - Using the front camera to look at drivers’ eyes to determine if they are focused
  - If they are not focused, prompt the AI to create a conversation to make the driver focused


  


  <br> <br>

## Stretch Goals :hourglass_flowing_sand:

- OCR scanning feature to digitize paper menus
- Language Conversion
- Reservations and waitlist management integration
- Gamification for restaurant exploration
- Crowdsourced menu changes/updates, leaving reviews/ratings, and photos of food for others to view.

<br>

## Milestones :calendar:

<details>
  
**<summary>Week 1: Set Up :rocket:</summary>**

#### General:
- Discuss with the team who’s frontend/backend and the overall project/tech stack
- Set up communication, environments, and WhenToMeet(Link available in doc)
- Go over GitHub basics
- Create a Figma account and start working on UI designs
  - Start with Low Fidelity and then build up to High Fidelity

#### Backend:
  - Start looking into MERN Stack (MongoDB, Express, React Native, Node.js)
  - lay around with the APIs (use Postman)
  - Look into LLM for chatbot and start playing around with it
<br>
</details>
  
<details>
  
**<summary>Week 2: Further Preparations :mag:</summary>**

#### Frontend:
  - Go over some UI design basics and do’s/don’ts
  - Try to finish up the Figma Design by the end of this week

#### Backend:
  - Start setting up the User Authentication and the Database. Have a working prototype by the end of the 2nd week
  - Keep doing research with the MERN stack, APIs, and LLMs
<br>
</details>

<details>
  
**<summary>Weeks 3/4: Coding :technologist:</summary>**
  
#### Frontend:
  - Start working on the frontend components
  - **Login/Create Pages** :door:
  - **Questionnaire Page** :question:
    - Questions to ask about the user’s dietary preferences
  - **Home Page** :house:
    - Should be able to view a list of Restaurants
      - Have a filter on how to view these restaurants
        - Based on Dietary Preferences, Prices, Ratings, Distance, etc.
    - **Access to Profile Page**
    - **Access to Chatbot Page**
    - If in a group setting, showcasing those in the group would be nice.
   
#### Backend:
  - Set up the APIs for gathering restaurants and food details
  - Start working on adding users into the group through username or QR code
    - Mainly look into how to develop unique QR codes and how to gather dietary information from others
  - Start training the LLM and setting up the chatbot
<br>
</details>

<details>

**<summary>Weeks 5/6: Middle Ground :construction:</summary>**
#### Frontend:
  - **Profile Page** :standing_person:
    - Has user’s information and their Dietary Preferences
    - **Group Profile** :people_holding_hands:
      - Can have multiple Group Profiles with the people and their dietary preferences
      - Ability to add users to the group either with username, QR code, or by manually creating a small profile
  - **Restaurant page** :shallow_pan_of_food:
    - Has the restaurant’s menu items
      - Organized by regular menu display with lunch, breakfast, dinner, appetizers, drinks, etc.
      - Collapsable sections for a better view
    - Filter Option to go with Personal/Group Dietary Preferences and/or other filter options
  - **Chatbot Page** :robot:
    - Should allow the user to input any text they want

#### Backend:
  - Connect the login/create page and Questionnaire page with the backend database
  - **Home Page** :house:
    - List the restaurants based on the location
    - Filter them based on what filter option the user chooses
      - Price, rating, dietary preferences, distance, etc.
  - **Group Profile Database** :people_holding_hands:
    - Adding people with either username, QR code, or manual setup
    - Ability to have multiple groups without having to repeat the process
  - **Restaurant+Menu Database** :plate_with_cutlery:
    - If certain information is unavailable then use outside APIs/databases(USDA, FatSecret) to analyze the content breakdown of certain menu items and include that within the database
      - Check with this first before suggesting any restaurant/food to the user.
    - Personalized recommendation algorithm for both restaurants and food
  - **Chatbot Implementation** :robot:
    - Have it work with some basic questions like:
      - Clarify menu items based on user or group information
      - If the user is in the mood for a certain meal then the chatbot can recommend the best options and pairings.

#### General:
- The backend team should, one at a time, start connecting the finished backend pages with the frontend team. During this, the frontend team should be testing the connection with a set of basic user cases.
- Moving in and out of pages, uploading correct and wrong information, etc.
<br>
</details>

<details>

**<summary>Weeks 7/8: Finishing Touches :checkered_flag:</summary>** 

#### General:
- Finish any remaining pages and implementations by the 7th week
- Finish connecting Frontend with Backend by the 8th week
- Have the Chatbot working
- If possible work on stretch goals
<br>
</details>

<details>

**<summary>Weeks 9/10: Preparations :sparkles:</summary>** 

#### General:
- Prep for Presentation Night! :partying_face:
- Make sure the Slides and Demo are ready and good to go
<br>
</details>

<br>

## Tech Stack & Resources :computer:

#### React Native
- <a href="https://reactnative.dev/docs/tutorial?language=javascript">Learn the Basics</a>
- <a href="https://reactnative.dev/docs/environment-setup">Setting up the Environment</a>
- <a href="https://www.youtube.com/watch?v=mrjy92pW0kM">React Native #1: Setup Visual Studio Code</a>
- <a href="https://www.youtube.com/watch?v=6ZnfsJ6mM5c">React Native Tutorial for Beginners - Getting Started</a>
- Getting the User’s location:
  - <a href="https://www.youtube.com/watch?v=d7G0E_9FwyE">Get Current Location,  Geocode and Reverse Geocode in Expo React Native Apps using expo-location</a>
- QR code
  - <a href="https://www.youtube.com/watch?v=ZAjrx36WJxU">Working with QR Codes and React-Native with Typescript [2022]</a>


#### Flutter
- <a href="https://docs.flutter.dev/">Documentation</a>
- Installation
  - <a href="https://www.youtube.com/watch?v=8saLa5fh0ZI">how to install flutter in windows 10 | how to setup flutter on windows | flutter installation</a>
- Basics Playlist
  - <a href="https://www.youtube.com/watch?v=1ukSR1GRtMU&list=PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ&index=2">Flutter Tutorial for Beginners #1 - Intro & Setup</a>
- QR code
  - <a href="https://www.youtube.com/watch?v=hHehIGfX_yU">Flutter Tutorial - QR Code Scanner App & QR Code Generator</a>

#### Android Studio
- <a href="https://www.youtube.com/watch?v=DM783YA0vbc">How to install Android Studio on Windows 10/11 [ 2023 Update ] Flamingo Installation</a>
- <a href="https://www.youtube.com/watch?v=ri90tcQL-Aw">How to Install Android Studio on Mac</a>


#### MERN Stack
- This works really well with React Native and with MongoDB it can handle any form of data without any issue
- MERN Stack Playlist. It goes over how to create user authentication. Hence, I suggest looking at that portion
  - <a href="https://www.youtube.com/watch?v=P5QbE9aRCLQ&list=PLaAoUJDWH9WrPXMOkqHHsPHxbhvRDqryM">How to Start WIth Node & Express From Zero - Node Authentication API Part-1</a>
- MongoDB Playlist:
  - <a href="https://www.youtube.com/watch?v=ExcRbA7fy_A&list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA">Complete MongoDB Tutorial #1 - What is MongoDB?</a>


#### APIs
- <a href="https://www.youtube.com/watch?v=KJhg761xb3c">Fetching Data from An API in React Native</a>
- <a href="https://rapidapi.com/search/restaurants/">Searching for APIs</a>
- Suggestions
  - <a href="https://tripadvisor-content-api.readme.io/reference/searchfornearbylocations">Tripadvisor API</a>
  - From Rapid API: <a href="https://rapidapi.com/ptwebsolution/api/restaurants222/">Restaurant API</a>
- <a href="https://www.youtube.com/watch?v=fgTGADljAeg">Build A REST API With Node.js, Express, & MongoDB - Quick</a>


#### LLM
- 5 min vid: <a href="https://www.youtube.com/watch?v=5sLYAQS9sWQ">How Large Language Models Work</a>
- Chatbot Fine Tuning
  - <a href="https://www.youtube.com/watch?v=eC6Hd1hFvos">Fine-tuning Large Language Models (LLMs) | w/ Example Code</a>
- <a href="https://js.langchain.com/docs/get_started/installation">Langchain</a>
  - <a href="https://www.youtube.com/watch?v=veV2I-NEjaM">Langchain JS | How to Use GPT-3, GPT-4 to Reference your own Data | OpenAI Embeddings Intro</a>
- <a href="https://openai.com/blog/introducing-chatgpt-and-whisper-apis">ChatGPT</a>
  - <a href="https://www.youtube.com/watch?v=1YU83Lw58eo">Write A ChatGPT Chatbot With Node.js</a>

<br>

## Roadblocks and Possible Solutions :construction: :bulb:

- Having everyone’s machine work with React Native.
  - If this is an issue then we can switch to Flutter and see if that works, otherwise confer with others to find a better solution that works for everyone.
- Fetching all the available restaurants nearby
  - If the online APIs or databases don’t contain the correct restaurants nearby then we would have to create our own database containing those values.
  - Or list the restaurants in Dallas rather than a specific location
- Implement the chatbot with the user’s dietary and restaurant information.
  - A solution to this would be to either create a small chatbot that answers basic questions or replace this feature with a stretch goal
- Either the Frontend or Backend team falling behind.
  - If this happens the best course would be to get some assistance from the other side until caught up

<br>

## Competition :vs:

- Yelp, Zomato, Tripadvisor (no personalization or AI assistant)
- Individual restaurant apps/sites (limited scope)
- Subpar diet filter sites (poor recommendations)
- General search engines (not food-specific)

<br>

## Git Commands :notebook:

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

<br>

## DineOutBuddy TEAM!! :partying_face: :fireworks:

- Jason Luu
- Adarsh Goura
- Amulya Prasad Rayabhagi
- Kousthub Ganugapati
- Jordan Tan
