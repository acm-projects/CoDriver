const DirectionsController = require('./directionsController');
const EventEmitter = require('events');
const axios = require('axios');
require('dotenv').config();

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

    async startNavigation(origin, destination) {
        try {
            console.log('Converting coordinates to addresses...');
            
            // convert coordinates to addresses if they're coordinate objects
            let originAddress = origin;
            let destinationAddress = destination;

            if (typeof origin === 'object' && origin.lat && origin.lng) {
                originAddress = await this.getAddressFromCoordinates(origin.lat, origin.lng);
            }

            if (typeof destination === 'object' && destination.lat && destination.lng) {
                destinationAddress = await this.getAddressFromCoordinates(destination.lat, destination.lng);
            }

            console.log('Getting directions from API');
            console.log('Origin address:', originAddress);
            console.log('Destination address:', destinationAddress);
            
            this.currentRoute = await DirectionsController.getDirections(originAddress, destinationAddress);
            console.log('Received route with steps:', this.currentRoute);

            this.currentStepIndex = 0;
            this.isNavigating = true;
            this.hasWarnedForCurrentStep = false;
            
            console.log('Starting location tracking');
            this.startLocationTracking();
            
            return { message: 'Navigation started', nextInstruction: this.currentRoute[0] };
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
        // default test position (my apartment)
        const defaultPosition = {
            lat: 32.98931,
            lng: -96.7549,
            accuracy: 10
        };

        // for testing in Node.js environment, return default position
        if (typeof navigator === 'undefined') {
            return defaultPosition;
        }

        // if in browser environment, try to get real position- FIGURE OUT FOR GETTING FROM NATIVE
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

    checkProgress(currentPosition) {
        if (!this.isNavigating || !this.currentRoute) {
            console.log('Navigation not active, skipping progress check');
            return;
        }

        console.log('Checking progress at position:', currentPosition);
        
        // check if approaching next turn
        this.checkApproachingTurn(currentPosition);
        
        if (this.hasReachedNextPoint(currentPosition)) {
            console.log('Reached next navigation point');
            this.currentStepIndex++;
            this.hasWarnedForCurrentStep = false;
            
            if (this.currentStepIndex >= this.currentRoute.length) {
                console.log('Navigation complete!');
                this.stopNavigation();
                this.emit('navigationComplete');
            } else {
                console.log('New instruction:', this.currentRoute[this.currentStepIndex]);
                this.emit('newInstruction', this.currentRoute[this.currentStepIndex]);
            }
        }
    }

    checkApproachingTurn(currentPosition) {
        if (!this.currentRoute || !this.currentRoute[this.currentStepIndex] || this.hasWarnedForCurrentStep) {
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
            console.log('Approaching next turn:', nextStep);
            this.emit('approachingTurn', {
                distance: Math.round(distance),
                instruction: nextStep
            });
            this.hasWarnedForCurrentStep = true;
        }
    }

    stopNavigation() {
        this.isNavigating = false;
        this.currentRoute = null;
        this.currentStepIndex = 0;
        this.hasWarnedForCurrentStep = false;
        if (this.watchId) {
            clearInterval(this.watchId);
            this.watchId = null;
        }
    }

    hasReachedNextPoint(currentPosition) {
        if (!this.currentRoute || !this.currentRoute[this.currentStepIndex]) {
            return false;
        }

        const nextStep = this.currentRoute[this.currentStepIndex];
        const nextStepLocation = this.getStepLocation(nextStep);

        // calculate the distance between current position and next waypoint
        const distance = this.calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            nextStepLocation.lat,
            nextStepLocation.lng
        );

        // consider user has reached the point if within 20 meters
        // you can adjust this threshold based on your needs
        const ARRIVAL_THRESHOLD = 20; // meters
        return distance <= ARRIVAL_THRESHOLD;
    }

    // helper function to calculate distance between two points using Haversine formula
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // earth's radius in meters
        const φ1 = this.toRadians(lat1);
        const φ2 = this.toRadians(lat2);
        const Δφ = this.toRadians(lat2 - lat1);
        const Δλ = this.toRadians(lon2 - lon1);

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // distance in meters
    }

    toRadians(degrees) {
        return degrees * (Math.PI/180);
    }

    // helper function to extract location from step
    getStepLocation(step) {
        // googled directions API provides end_location for each step
        return {
            lat: step.end_location.lat,
            lng: step.end_location.lng
        };
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
}

module.exports = new NavigationController(); 

