const DirectionsController = require('./directionsController');
const EventEmitter = require('events');
const axios = require('axios');
require('dotenv').config();
const AIController = require('./aiController');
const hazardController = require('./hazardController');

class NavigationController extends EventEmitter {
    constructor() {
        super();
        console.log('NavigationController initialized');
        this.currentRoute = null;
        this.currentStepIndex = 0;
        this.isNavigating = false;
        this.watchId = null;
        this.hasWarnedForCurrentStep = false;
        this.lastEmittedEvent = null; // to store the last emitted event for testing
        this.isSimulationMode = false; // new flag for simulation mode
        this.simulatedPosition = null; // store the current simulated position
        this.routePoints = null; // store the generated route points
    }

    async getAddressFromCoordinates(lat, lng) {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    latlng: `${lat},${lng}`,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });

            if (response.data.results && response.data.results.length > 0) {
                return response.data.results[0].formatted_address;
            }
            throw new Error('No address found for these coordinates');
        } catch (error) {
            console.error('Error geocoding coordinates:', error);
            throw error;
        }
    }

    async getCoordinatesFromAddress(address) {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });

            if (response.data.results && response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                return {
                    lat: location.lat,
                    lng: location.lng
                };
            }
            throw new Error('No coordinates found for address');
        } catch (error) {
            console.error('Error geocoding address:', error);
            throw error;
        }
    }

    async startNavigation(origin, destination) {
        try {
            console.log('Starting navigation...');
            console.log('Origin:', origin);
            console.log('Destination:', destination);

            // get the route and generate points
            this.currentRoute = await DirectionsController.getDirections(origin, destination);
            this.routePoints = await this.generateRoutePoints(origin, destination);
            
            this.currentStepIndex = 0;
            this.isNavigating = true;
            this.hasWarnedForCurrentStep = false;

            // if in simulation mode, set initial position
            if (this.isSimulationMode) {
                this.simulatedPosition = this.routePoints[0];
            }

            return {
                message: 'Navigation started',
                nextInstruction: this.currentRoute[0],
                origin: this.routePoints[0],
                destination: this.routePoints[this.routePoints.length - 1],
                routePoints: this.routePoints
            };
        } catch (error) {
            console.error('Error starting navigation:', error);
            return { error: 'Failed to start navigation: ' + error.message };
        }
    }

    startLocationTracking() {
        console.log('Location tracking started');
        this.watchId = setInterval(() => {
            this.getCurrentPosition()
                .then(position => {
                    console.log('Current position:', position);
                    this.checkProgress(position);
                })
                .catch(error => console.error('Error getting position:', error));
        }, 5000);
    }

    async getCurrentPosition() {
        // if in simulation mode, return the simulated position
        if (this.isSimulationMode && this.simulatedPosition) {
            console.log('Returning simulated position:', this.simulatedPosition);
            return this.simulatedPosition;
        }

        // default test position (my apartment)
        const defaultPosition = {
            lat: 32.98931,
            lng: -96.7549,
            accuracy: 10
        };

        // for testing in Node.js environment, return default position
        if (typeof navigator === 'undefined') {
            console.log('Returning default position:', defaultPosition);
            return defaultPosition;
        }

        // if in browser environment, try to get real position
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                    },
                    (error) => {
                        console.warn('Geolocation error, using default position:', error);
                        resolve(defaultPosition);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            } else {
                console.warn('Geolocation not supported, using default position');
                resolve(defaultPosition);
            }
        });
    }

    async checkProgress(currentPosition) {
        if (!this.isNavigating || !this.currentRoute) {
            console.log('Navigation not active, skipping progress check');
            return;
        }

        console.log('Checking progress at position:', currentPosition);
        
        // check if approaching next turn
        await this.checkApproachingTurn(currentPosition);

        await this.checkHazardousConditions(currentPosition);
        
        if (this.hasReachedNextPoint(currentPosition)) {
            console.log('Reached next navigation point');
            
            // move to next step
            this.currentStepIndex++;
            
            if (this.currentStepIndex >= this.currentRoute.length) {
                console.log('Navigation complete!');
                this.stopNavigation();
                // this.emit('navigationComplete'); already emmits after stopNavigation
            } else {
                const nextStep = this.currentRoute[this.currentStepIndex];
                // reset warning flag when moving to new step and format instruction
                this.hasWarnedForCurrentStep = false;
                
               this.emit('newInstruction', nextStep);
            }
        }
    }

    async checkHazardousConditions(currentPosition) {
        // Check for hazardous conditions using AIController
        try {
            const hazards = await hazardController.checkForHazards(currentPosition);
            if (hazards && hazards.length > 0) {
                console.log('Hazardous conditions detected:', hazards);
                this.emit('hazardousConditions', hazards);
            }
        } catch (error) {
            console.error('Error checking hazardous conditions:', error);
        }
    }

    async checkApproachingTurn(currentPosition) {
        if (!this.currentRoute || !this.currentRoute[this.currentStepIndex] || this.hasWarnedForCurrentStep) {
            console.log('Approaching turn check skipped');
            return;
        }

        const nextStep = this.currentRoute[this.currentStepIndex];
        const nextStepLocation = this.getStepLocation(nextStep);

        const distance = this.calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            nextStepLocation.lat,
            nextStepLocation.lng
        );

        // emit warning when within 100 meters of the next turn
        const APPROACH_WARNING_THRESHOLD = 100; // meters
        if (distance <= APPROACH_WARNING_THRESHOLD) {
            // console.log('Approaching next turn:', nextStep);
            
            const formattedWarning = await AIController.formatNavigationInstruction({
                instruction: nextStep.instruction,
                distance: distance,
                duration: nextStep.duration,
                maneuver: nextStep.maneuver
            });
            
            this.emit('approachingTurn', {
                distance: Math.round(distance),
                instruction: formattedWarning.instruction
            });
            
            this.hasWarnedForCurrentStep = true;
        }
    }

    stopNavigation() {
        this.isNavigating = false;
        //this.currentRoute = null;
        //this.currentStepIndex = 0;
        this.hasWarnedForCurrentStep = false;
        if (this.watchId) {
            clearInterval(this.watchId);
            this.watchId = null;
        }

        // emit navigation complete with final stats
        const finalStats = {
            totalSteps: this.currentRoute ? this.currentRoute.length : 0,
            completedSteps: this.currentStepIndex
        };
        this.emit('navigationComplete', finalStats);

        // only clear route data after emitting final events
        this.currentRoute = null;
        this.currentStepIndex = 0;
    }

    hasReachedNextPoint(currentPosition) {
        if (!this.currentRoute || !this.isNavigating) {
            return false;
        }
        
        if (!this.currentRoute || !this.currentRoute[this.currentStepIndex]) {
            return false;
        }

        const nextStep = this.currentRoute[this.currentStepIndex];
        const stepEndLocation = this.getStepLocation(nextStep); // This will now use end_location

        // calculate the distance between current position and the end of current step
        const distance = this.calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            stepEndLocation.lat,
            stepEndLocation.lng
        );

        console.log('Distance to end of current step:', distance, 'meters');
        console.log('Current position:', currentPosition);
        console.log('Step end location:', stepEndLocation);

        // Consider the step complete when we're close to its end location
        const ARRIVAL_THRESHOLD = 50; // meters
        return distance <= ARRIVAL_THRESHOLD;
    }

    // helper function to calculate distance between two points using Haversine formula
    calculateDistance(lat1, lng1, lat2, lng2) {
        // Input validation
        if (!lat1 || !lng1 || !lat2 || !lng2) {
            console.error('Invalid coordinates for distance calculation:', { lat1, lng1, lat2, lng2 });
            return Infinity; // Return Infinity to indicate invalid distance
        }

        // Convert all inputs to numbers
        lat1 = Number(lat1);
        lng1 = Number(lng1);
        lat2 = Number(lat2);
        lng2 = Number(lng2);

        // log the points being compared
        // console.log('Calculating distance between:', 
        //     { point1: { lat: lat1, lng: lng1 }, 
        //       point2: { lat: lat2, lng: lng2 }
        //     });

        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lng2 - lng1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                 Math.cos(φ1) * Math.cos(φ2) *
                 Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const distance = R * c;
        //console.log('Calculated distance:', distance, 'meters');
        return distance;
    }

    toRadians(degrees) {
        return degrees * (Math.PI/180);
    }

    // helper function to extract location from step
    getStepLocation(step) {
        console.log('Getting location from step:', step);
        
        // Input validation
        if (!step) {
            console.error('Step is null or undefined');
            return null;
        }

        // First try to use direct lat/lng (for our custom route points)
        if (typeof step.lat === 'number' && typeof step.lng === 'number') {
            console.log('Using direct lat/lng');
            return {
                lat: Number(step.lat),
                lng: Number(step.lng)
            };
        }
        // Use end_location to track progress to the end of each step
        else if (step.end_location) {
            console.log('Using step.end_location');
            return {
                lat: Number(step.end_location.lat),
                lng: Number(step.end_location.lng)
            };
        }
        
        console.error('Unable to extract location from step:', step);
        return null;
    }

    // method to get current location as a formatted string
    async getCurrentLocationAsString() {
        try {
            const position = await this.getCurrentPosition();
            return `${position.lat},${position.lng}`;
        } catch (error) {
            console.error('Error getting current location:', error);
            throw new Error('Could not get current location');
        }
    }

    // modify startNavigationTest to also handle current location
    async startNavigationTest(origin, destination) {
        // If origin is not provided, get current location
        if (!origin) {
            try {
                origin = await this.getCurrentLocationAsString();
            } catch (error) {
                return { error: 'Could not get current location' };
            }
        }

        const result = await this.startNavigation(origin, destination);
        // override the interval-based tracking for testing
        if (this.watchId) {
            clearInterval(this.watchId);
            this.watchId = null;
        }
        return result;
    }

    // method to simulate position updates
    simulatePosition(position) {
        if (!this.isNavigating) {
            return { error: 'Navigation not active' };
        }

        this.lastEmittedEvent = null; // reset last event

        // override emit method temporarily to capture events
        const originalEmit = this.emit.bind(this);
        this.emit = (event, data) => {
            this.lastEmittedEvent = { event, data };
            originalEmit(event, data);
        };

        // process the position
        this.checkProgress(position);

        // restore original emit
        this.emit = originalEmit;

        // return the last emitted event if any
        return {
            currentStep: this.currentStepIndex,
            isNavigating: this.isNavigating,
            lastEvent: this.lastEmittedEvent,
            totalSteps: this.currentRoute ? this.currentRoute.length : 0
        };
    }

    // method to get current navigation state
    getNavigationState() {
        return {
            isNavigating: this.isNavigating,
            currentStepIndex: this.currentStepIndex,
            currentStep: this.currentRoute ? this.currentRoute[this.currentStepIndex] : null,
            totalSteps: this.currentRoute ? this.currentRoute.length : 0
        };
    }

    // New method to enable simulation mode
    enableSimulationMode() {
        this.isSimulationMode = true;
        console.log('Simulation mode enabled');
    }

    // New method to disable simulation mode
    disableSimulationMode() {
        this.isSimulationMode = false;
        this.simulatedPosition = null;
        console.log('Simulation mode disabled');
    }

    // New method to update simulated position
    updateSimulatedPosition(position) {
        if (!this.isSimulationMode) {
            console.log('Simulation mode not enabled, ignoring position update');
            return;
        }

        // Ensure position has valid coordinates
        if (!position || typeof position.lat !== 'number' || typeof position.lng !== 'number') {
            console.error('Invalid position provided for simulation:', position);
            return;
        }

        // Format coordinates to 6 decimal places to avoid scientific notation
        this.simulatedPosition = {
            lat: Number(position.lat.toFixed(6)),
            lng: Number(position.lng.toFixed(6))
        };

        console.log('Updated simulated position:', this.simulatedPosition);
        
        // Check progress with the new position
        this.checkProgress(this.simulatedPosition);
    }

    async generateRoutePoints(origin, destination) {
        try {
            // Get the route from Google Directions API - use the same route as navigation
            const route = await DirectionsController.getDirections(origin, destination);
            if (!route || !route.length) {
                throw new Error('No route found');
            }

            const points = [];
            const POINT_SPACING = 200; // meters between points

            // Add the origin point first
            points.push({
                lat: route[0].start_location.lat,
                lng: route[0].start_location.lng,
                instruction: route[0].instruction,
                isNavigationPoint: true
            });

            // for each step in the route
            for (let i = 0; i < route.length; i++) {
                const step = route[i];
                
                // add intermediate points between start and end
                const start = step.start_location;
                const end = step.end_location;
                const stepDistance = this.calculateDistance(
                    start.lat, start.lng,
                    end.lat, end.lng
                );

                // calculate number of intermediate points
                const numPoints = Math.max(1, Math.floor(stepDistance / POINT_SPACING));

                // add intermediate points
                for (let j = 1; j < numPoints; j++) {
                    const fraction = j / numPoints;
                    points.push({
                        lat: start.lat + (end.lat - start.lat) * fraction,
                        lng: start.lng + (end.lng - start.lng) * fraction,
                        isNavigationPoint: false // intermediate point
                    });
                }

                // add the end point of this step
                points.push({
                    lat: end.lat,
                    lng: end.lng,
                    instruction: step.instruction,
                    isNavigationPoint: true // actual navigation point
                });
            }

            return points;
        } catch (error) {
            console.error('Error generating route points:', error);
            throw error;
        }
    }


    isKeyNavigationPoint(position) {
        // check if this position represents a significant navigation point
        // like turns, exits, or major intersections
        if (!this.currentRoute || !this.currentRoute[this.currentStepIndex]) {
            return false;
        }

        const currentStep = this.currentRoute[this.currentStepIndex];
        return this.isSignificantManeuver(currentStep);
    }

    isSignificantManeuver(step) {
        // Define what constitutes a significant maneuver
        const significantManeuvers = [
            'turn-right',
            'turn-left',
            'merge',
            'take-exit',
            'roundabout',
            'u-turn',
            'destination'
        ];

        return step.maneuver && significantManeuvers.includes(step.maneuver);
    }

    getTemplatedInstruction(step) {
        // Simple templated instructions for non-key points
        if (step.maneuver === 'straight') {
            return 'Continue straight ahead';
        }
        if (step.distance) {
            return `Continue for ${Math.round(step.distance)} meters`;
        }
        return step.instruction; // fallback to original instruction
    }
}

module.exports = new NavigationController(); 

