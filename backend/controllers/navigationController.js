const DirectionsController = require('./directionsController');
const EventEmitter = require('events');

class NavigationController extends EventEmitter {
    constructor() {
        super();
        console.log('NavigationController initialized');
        this.currentRoute = null;
        this.currentStepIndex = 0;
        this.isNavigating = false;
        this.watchId = null;
    }

    async startNavigation(origin, destination) {
        try {
            console.log('Getting directions from API');
            this.currentRoute = await DirectionsController.getDirections(origin, destination);
            console.log('Received route with steps:', this.currentRoute);

            
            
            this.currentStepIndex = 0;
            this.isNavigating = true;
            
            console.log('Starting location tracking');
            this.startLocationTracking();
            
            return { message: 'Navigation started', nextInstruction: this.currentRoute[0] };
        } catch (error) {
            console.error('Error starting navigation:', error);
            return { error: 'Failed to start navigation' };
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
        // if using browser-based geolocation
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy // unit is in meters
                        });
                    },
                    (error) => {
                        reject(error);
                    },
                    {
                        enableHighAccuracy: true, // use GPS if available
                        timeout: 5000, // time to wait for position
                        maximumAge: 0 // don't use cached position
                    }
                );
            } else {
                reject(new Error("Geolocation is not supported"));
            }
        });
    }

    checkProgress(currentPosition) {
        if (!this.isNavigating || !this.currentRoute) {
            console.log('⏸️ Navigation not active, skipping progress check');
            return;
        }

        console.log('Checking progress at position:', currentPosition);
        if (this.hasReachedNextPoint(currentPosition)) {
            console.log('Reached next navigation point');
            this.currentStepIndex++;
            
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

    stopNavigation() {
        this.isNavigating = false;
        this.currentRoute = null;
        this.currentStepIndex = 0;
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
}

module.exports = new NavigationController(); 

