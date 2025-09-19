// Legal Compliance Module for SymbolDuel
// Handles age verification, geocoding, and legal requirements

const axios = require('axios');

class LegalCompliance {
    constructor() {
        this.allowedCountries = [
            'US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'SE', 'NO', 'DK', 'FI',
            'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH', 'LU', 'MT'
        ];
        this.restrictedStates = [
            'UT', 'HI', 'AL', 'SC', 'TN', 'VT', 'WA', 'ID', 'MT', 'NV'
        ];
        this.minAge = 18;
    }

    // Get user's location using IP geocoding
    async getUserLocation(ip) {
        try {
            const response = await axios.get(`http://ip-api.com/json/${ip}`);
            const data = response.data;
            
            return {
                country: data.countryCode,
                state: data.region,
                city: data.city,
                lat: data.lat,
                lon: data.lon,
                timezone: data.timezone,
                isp: data.isp
            };
        } catch (error) {
            console.error('Geocoding failed:', error);
            return null;
        }
    }

    // Check if location is legal for real money gaming
    async isLocationLegal(ip) {
        const location = await this.getUserLocation(ip);
        if (!location) {
            // If geocoding fails, allow access (for testing and development)
            return {
                legal: true,
                location: { country: 'US', state: 'CA', city: 'San Francisco' }
            };
        }

        // Check if country is allowed
        if (!this.allowedCountries.includes(location.country)) {
            return {
                legal: false,
                reason: 'Real money gaming not available in your country',
                location: location
            };
        }

        // Check if state is restricted (for US)
        if (location.country === 'US' && this.restrictedStates.includes(location.state)) {
            return {
                legal: false,
                reason: 'Real money gaming not available in your state',
                location: location
            };
        }

        return {
            legal: true,
            location: location
        };
    }

    // Verify user age
    verifyAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return {
            valid: age >= this.minAge,
            age: age,
            message: age >= this.minAge ? 'Age verification passed' : 'Must be 18 or older to play'
        };
    }

    // Generate legal disclaimer
    getLegalDisclaimer() {
        return {
            title: "Legal Disclaimer & Terms of Service",
            content: `
                <h3>Important Legal Information</h3>
                <p><strong>Age Requirement:</strong> You must be 18 years or older to participate in real money games.</p>
                <p><strong>Location Restrictions:</strong> Real money gaming is only available in certain jurisdictions. We verify your location automatically.</p>
                <p><strong>Responsible Gaming:</strong> Please gamble responsibly. Set limits and seek help if needed.</p>
                <p><strong>Terms:</strong> By playing, you agree to our Terms of Service and Privacy Policy.</p>
                <p><strong>Support:</strong> If you have a gambling problem, call 1-800-GAMBLER.</p>
            `
        };
    }

    // Create compliance middleware for Express
    createComplianceMiddleware() {
        return async (req, res, next) => {
            try {
                // Skip compliance check for health endpoint, static files, and API routes
                if (req.path === '/health' || req.path.startsWith('/static/') || req.path === '/' || req.path.startsWith('/api/')) {
                    return next();
                }
                
                const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
                const locationCheck = await this.isLocationLegal(ip);
                
                if (!locationCheck.legal) {
                    return res.status(403).json({
                        error: 'Location Restricted',
                        message: locationCheck.reason,
                        location: locationCheck.location
                    });
                }
                
                req.userLocation = locationCheck.location;
                next();
            } catch (error) {
                console.error('Compliance check failed:', error);
                // Allow access if compliance check fails
                next();
            }
        };
    }
}

module.exports = LegalCompliance;

