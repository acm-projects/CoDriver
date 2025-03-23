const axios = require('axios');
const EventEmitter = require('events');
const AIController = require('./aiController');
require('dotenv').config();

class HazardController extends EventEmitter {
    constructor() {
        super();
        this.watchId = null;
        this.isMonitoring = false;
        this.lastCheckedHazards = new Set();
        this.HAZARD_CHECK_RADIUS = 2000; // 2km radius for now, might change
    }

    async startHazardMonitoring(currentPosition) {
        if (this.isMonitoring) {
            return { success: false, message: 'Hazard monitoring already active' };
        }

        
        if (!process.env.GOOGLE_MAPS_API_KEY) {
            return { success: false, message: 'Google Maps API key not configured' };
        }

        this.isMonitoring = true;
        this.watchId = setInterval(async () => {
            try {
                await this.checkForHazards(currentPosition);
            } catch (error) {
                console.error('Error checking hazards:', error);
            }
        }, 30000); // check every 30 seconds

        return { success: true, message: 'Hazard monitoring started' };
    }

    stopHazardMonitoring() {
        if (this.watchId) {
            clearInterval(this.watchId);
            this.watchId = null;
        }
        this.isMonitoring = false;
        this.lastCheckedHazards.clear();
        return { success: true, message: 'Hazard monitoring stopped' };
    }

    async checkForHazards(position) {
        try {
            const snappedPoints = await this.getNearbyRoads(position);
            const trafficData = await this.getTrafficData(snappedPoints);
            const currentHazards = new Set();
            
            if (trafficData.incidents) {
                for (const incident of trafficData.incidents) {
                    const hazardId = `${incident.id}`;
                    currentHazards.add(hazardId);

                    if (!this.lastCheckedHazards.has(hazardId)) {
                        const hazardInfo = {
                            type: this.getHazardType(incident.type),
                            severity: incident.severity,
                            location: {
                                lat: incident.location.lat,
                                lng: incident.location.lng
                            },
                            description: incident.description || this.getDefaultDescription(incident.type),
                            distance: this.calculateDistance(
                                position.lat,
                                position.lng,
                                incident.location.lat,
                                incident.location.lng
                            )
                        };

                        // get AI response for the hazard
                        const aiResponse = await AIController.handleUserInput("What's the current road condition?", hazardInfo);
                        
                        // emit both the hazard info and the AI's conversational response
                        this.emit('newHazard', {
                            ...hazardInfo,
                            aiResponse
                        });
                    }
                }
            }

            this.lastCheckedHazards = currentHazards;
            return { success: true, hazardsCount: currentHazards.size };
        } catch (error) {
            console.error('Error fetching hazards:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || error.message 
            };
        }
    }

    async getNearbyRoads(position) {
        try {
            // get roads within the radius by creating a set of points around the current position
            const points = this.generatePointsAroundPosition(position, this.HAZARD_CHECK_RADIUS);
            const pointsString = points.map(p => `${p.lat},${p.lng}`).join('|');

            const response = await axios.get('https://roads.googleapis.com/v1/snapToRoads', {
                params: {
                    path: pointsString,
                    interpolate: true,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });

            return response.data.snappedPoints || [];
        } catch (error) {
            console.error('Error getting nearby roads:', error);
            return [];
        }
    }

    async getTrafficData(snappedPoints) {
        try {
            // use the Places API to get traffic data for the road segments
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                params: {
                    location: `${snappedPoints[0].location.latitude},${snappedPoints[0].location.longitude}`,
                    radius: this.HAZARD_CHECK_RADIUS,
                    type: 'route',
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });

            // process and return traffic incidents
            return this.processTrafficData(response.data);
        } catch (error) {
            console.error('Error getting traffic data:', error);
            return { incidents: [] };
        }
    }

    processTrafficData(data) {
        const incidents = [];
        
        if (data.results) {
            data.results.forEach(place => {
                if (place.business_status === 'CLOSED_TEMPORARILY') {
                    incidents.push({
                        id: place.place_id,
                        type: 'ROAD_CLOSED',
                        severity: 'HIGH',
                        location: {
                            lat: place.geometry.location.lat,
                            lng: place.geometry.location.lng
                        },
                        description: place.name
                    });
                }
            });
        }

        return { incidents };
    }

    generatePointsAroundPosition(center, radius) {
        const points = [];
        const numPoints = 8; // generate 8 points around the circle
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i * 2 * Math.PI) / numPoints;
            const dx = radius * Math.cos(angle);
            const dy = radius * Math.sin(angle);
            
            // convert dx,dy to lat,lng
            const lat = center.lat + (dy / 111111); // 111111 meters per degree of latitude
            const lng = center.lng + (dx / (111111 * Math.cos(center.lat * Math.PI / 180)));
            
            points.push({ lat, lng });
        }
        
        return points;
    }

    getHazardType(googleType) {
        const hazardTypes = {
            'ROAD_CLOSED': 'Road Closure',
            'CONSTRUCTION': 'Construction',
            'ACCIDENT': 'Accident',
            'CONGESTION': 'Heavy Traffic',
            'EVENT': 'Special Event',
            'LANE_CLOSED': 'Lane Closure',
            'WEATHER': 'Weather Condition'
        };
        return hazardTypes[googleType] || 'Road Issue';
    }

    getDefaultDescription(type) {
        const descriptions = {
            'ROAD_CLOSED': 'Road closed ahead',
            'CONSTRUCTION': 'Construction zone ahead',
            'ACCIDENT': 'Accident reported ahead',
            'CONGESTION': 'Heavy traffic ahead',
            'EVENT': 'Special event affecting traffic',
            'LANE_CLOSED': 'Lane closure ahead',
            'WEATHER': 'Weather-related hazard ahead'
        };
        return descriptions[type] || 'Road hazard ahead';
    }

    // keep existing helper methods
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = this.toRadians(lat1);
        const φ2 = this.toRadians(lat2);
        const Δφ = this.toRadians(lat2 - lat1);
        const Δλ = this.toRadians(lon2 - lon1);

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI/180);
    }

    async getCurrentHazards(position) {
        try {
            const result = await this.checkForHazards(position);
            if (result.success) {
                return {
                    success: true,
                    hazards: Array.from(this.lastCheckedHazards)
                };
            }
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new HazardController(); 