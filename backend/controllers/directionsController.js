const axios = require('axios');

class DirectionsController {

    // function to get step by step directions from google maps
    async getDirections(origin, destination) {
        try {
            console.log('Fetching directions from Google Maps API...');
            console.log('Origin:', origin);
            console.log('Destination:', destination);

            
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
            );
            
            console.log('Received response from Google Maps API');
            
            // extract turn-by-turn instructions with location data
            const steps = response.data.routes[0].legs[0].steps;
            const instructions = steps.map(step => ({
                instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // removing the HTML tags
                distance: step.distance.text,
                duration: step.duration.text,
                maneuver: step.maneuver || null,
                start_location: step.start_location,
                end_location: step.end_location
            }));
            
            console.log('Processed', instructions.length, 'navigation steps');
            return instructions;
        } catch (error) {
            console.error('Error fetching directions:', error);
            if (error.response) {
                console.error('Google Maps API response:', error.response.data);
            }
            return { error: 'Failed to fetch directions' };
        }
    }

}

module.exports = new DirectionsController();