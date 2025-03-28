const WebSocket = require('ws');
const axios = require('axios');

async function updatePosition(lat, lng) {
    try {
        // update the app's simulated location directly
        await axios.post('http://localhost:3000/api/simulation/location', {
            lat,
            lng,
            accuracy: 10
        });
        console.log(`Updated position to: ${lat}, ${lng}`);
    } catch (error) {
        console.error('Error updating position:', error);
    }
}

async function startNavigationTest() {
    try {
        // define start and end points- make input variable when integrating with frontend
        const origin = "2800 Waterview Pkwy, Richardson, TX 75080";
        const destination = "242 W Campbell Rd, Richardson, TX 75080";

        // connect to websocket
        const ws = new WebSocket('ws://localhost:3000');
        
        ws.on('open', async () => {
            console.log('Connected to server');

            // enable simulation mode
            await axios.post('http://localhost:3000/api/simulation/enable');
            console.log('Simulation mode enabled');

            // start navigation
            const response = await axios.post('http://localhost:3000/api/navigation/start', {
                origin,
                destination
            });
            console.log('Navigation started:', response.data);

            // get route points from the response
            const routePoints = response.data.routePoints;
            console.log(`Simulating navigation through ${routePoints.length} points`);

            // simulate movement through the route points
            for (const point of routePoints) {
                await updatePosition(point.lat, point.lng);
                await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds between updates- could change this to be the duration of each navigation step
            }
        });

        // handle websocket messages
        ws.on('message', (data) => {
            const message = JSON.parse(data);
            console.log('Received:', message);
        });

        // handle websocket errors
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        // handle websocket close
        ws.on('close', () => {
            console.log('Disconnected from server');
        });

    } catch (error) {
        console.error('Error in navigation test:', error);
    }
}

// start the test -- make an endpoint for this in the app.js when integrating with frontend
startNavigationTest(); 