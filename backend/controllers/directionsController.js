const axios = require('axios');
require('dotenv').config();

class DirectionsController {
    async getDirections(origin, destination) {
        try {
            console.log('Fetching directions from Google Maps API...');
            //console.log('Origin:', origin);
            //console.log('Destination:', destination);

            // URL encode the origin and destination
            const encodedOrigin = encodeURIComponent(origin);
            const encodedDestination = encodeURIComponent(destination);

            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${encodedOrigin}&destination=${encodedDestination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
            );
            
            console.log('Received response from Google Maps API');
            
            if (!response.data.routes || response.data.routes.length === 0) {
                throw new Error('No route found');
            }

            // extract turn-by-turn instructions with location data
            const steps = response.data.routes[0].legs[0].steps;
            const instructions = steps.map(step => ({
                instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // removing HTML tags
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
            throw error;
        }
    }
}

// Export a new instance of the controller
module.exports = new DirectionsController();