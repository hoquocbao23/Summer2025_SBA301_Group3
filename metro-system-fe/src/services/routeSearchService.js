import axiosInstance from '../config/axios';

const ROUTE_SEARCH_ENDPOINTS = {
  SEARCH: '/routes/search'
};

export class RouteSearchService {
  /**
   * Search routes between two stations using new API format
   * @param {number} sourceStationId - Source station ID
   * @param {number} destinationStationId - Destination station ID
   * @param {number} k - Number of paths to find (optional)
   * @returns {Promise<Object>} Search results response
   */
  static async searchRoutes(sourceStationId, destinationStationId, k = 100) {
    try {
      const response = await axiosInstance.get(ROUTE_SEARCH_ENDPOINTS.SEARCH, {
        params: {
          source: sourceStationId,
          dest: destinationStationId,
          k: k
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search routes using GET method with query parameters
   * @param {number} sourceStationId - Source station ID
   * @param {number} destinationStationId - Destination station ID
   * @returns {Promise<Object>} Search results response
   */
  static async searchRoutesGet(sourceStationId, destinationStationId) {
    try {
      const response = await axiosInstance.get(ROUTE_SEARCH_ENDPOINTS.SEARCH, {
        params: {
          sourceStationId,
          destinationStationId
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Transform API response to frontend format for new API structure
   * @param {Object} apiResponse - API response data
   * @returns {Object} Transformed data for frontend
   */
  static transformSearchResults(apiResponse) {
    if (!apiResponse || !apiResponse.data || !apiResponse.data.paths) {
      return {
        sourceStation: null,
        destinationStation: null,
        paths: [],
        totalPathsFound: 0
      };
    }

    const { data } = apiResponse;
    const paths = data.paths || [];

    // Extract source and destination from first path
    let sourceStation = null;
    let destinationStation = null;

    if (paths.length > 0 && paths[0].routes && paths[0].routes.length > 0) {
      const firstRoute = paths[0].routes[0];
      const lastRoute = paths[0].routes[paths[0].routes.length - 1];
      
      if (firstRoute.stations && firstRoute.stations.length > 0) {
        const firstStation = firstRoute.stations[0];
        sourceStation = {
          id: firstStation.stationId,
          name: firstStation.stationName,
          location: firstStation.stationLocation || "Ho Chi Minh City"
        };
      }

      if (lastRoute.stations && lastRoute.stations.length > 0) {
        const lastStation = lastRoute.stations[lastRoute.stations.length - 1];
        destinationStation = {
          id: lastStation.stationId,
          name: lastStation.stationName,
          location: lastStation.stationLocation || "Ho Chi Minh City"
        };
      }
    }

    return {
      sourceStation,
      destinationStation,
      paths: paths.map((path, pathIndex) => {
        // Convert routes to segments format for consistency with frontend
        const segments = this.convertRoutesToSegments(path.routes || []);
        
        return {
          id: pathIndex + 1,
          routes: path.routes?.map(route => ({
            id: route.routeId,
            name: route.routeName,
            color: this.getRouteColor(route.routeId),
            stations: route.stations?.map(station => ({
              id: station.stationId,
              name: station.stationName,
              location: station.stationLocation,
              order: station.order
            })) || []
          })) || [],
          segments: segments,
          totalDistance: path.totalDistance || 0,
          totalDuration: this.calculateDuration(path.totalDistance || 0),
          totalPrice: segments.reduce((sum, segment) => sum + segment.price, 0),
          transferCount: Math.max((path.routes?.length || 1) - 1, 0),
          isDirectRoute: (path.routes?.length || 0) <= 1
        };
      }),
      totalPathsFound: paths.length
    };
  }

  /**
   * Convert routes array to segments format for frontend compatibility
   * @param {Array} routes - Array of routes from API
   * @returns {Array} Array of segments
   */
  static convertRoutesToSegments(routes) {
    const segments = [];
    
    routes.forEach((route, routeIndex) => {
      if (route.stations && route.stations.length >= 2) {
        // For each route, create a segment from first to last station
        const firstStation = route.stations[0];
        const lastStation = route.stations[route.stations.length - 1];
        const segmentDistance = this.calculateSegmentDistance(route.stations);
        
        segments.push({
          id: route.routeId * 1000 + routeIndex, // Unique segment ID
          routeId: route.routeId,
          routeName: route.routeName,
          color: this.getRouteColor(route.routeId),
          fromStation: {
            id: firstStation.stationId,
            name: firstStation.stationName,
            location: firstStation.stationLocation || "Ho Chi Minh City",
            openTime: "05:00",
            closeTime: "23:00"
          },
          toStation: {
            id: lastStation.stationId,
            name: lastStation.stationName,
            location: lastStation.stationLocation || "Ho Chi Minh City",
            openTime: "05:00",
            closeTime: "23:00"
          },
          distance: segmentDistance,
          duration: this.calculateSegmentDuration(route.stations),
          price: this.calculateSegmentPrice(segmentDistance, route.ticketRule)
        });
      }
    });
    
    return segments;
  }

  /**
   * Calculate distance for a segment based on stations
   * @param {Array} stations - Array of stations in the route
   * @returns {number} Distance in km
   */
  static calculateSegmentDistance(stations) {
    // Simple calculation: assume 2km per station pair
    return Math.max((stations.length - 1) * 2, 1);
  }

  /**
   * Calculate duration for a segment based on stations
   * @param {Array} stations - Array of stations in the route
   * @returns {number} Duration in minutes
   */
  static calculateSegmentDuration(stations) {
    // Simple calculation: assume 3 minutes per station
    return Math.max((stations.length - 1) * 3, 2);
  }

  /**
   * Calculate price for a segment based on distance and route's ticket rule
   * @param {number} distance - Distance in km
   * @param {Object} ticketRule - Route's ticket rule containing basePrice and pricePerKm
   * @returns {number} Price in VND
   */
  static calculateSegmentPrice(distance, ticketRule = null) {
    // Default values if ticketRule is not provided
    const basePrice = ticketRule?.basePrice || 6000;
    const pricePerKm = ticketRule?.pricePerKm || 1000;
    
    // Apply pricing formula: if distance < 6km, use basePrice only
    if (distance < 6) {
      return basePrice;
    } else {
      return basePrice + Math.ceil((distance - 6) * pricePerKm);
    }
  }

  /**
   * Calculate estimated duration based on distance
   * @param {number} distance - Distance in km
   * @returns {number} Duration in minutes
   */
  static calculateDuration(distance) {
    // Assume average speed of 40 km/h including stops
    const baseTime = Math.ceil(distance * 1.5); // 1.5 minutes per km
    return Math.max(baseTime, 5); // Minimum 5 minutes
  }

  /**
   * Calculate price based on distance
   * @param {number} distance - Distance in km
   * @returns {number} Price in VND
   */
  static calculatePrice(distance) {
    const basePrice = 8000; // Base price 8,000 VND
    const pricePerKm = 2000; // 2,000 VND per km
    return basePrice + Math.ceil(distance * pricePerKm);
  }

  /**
   * Get route color based on route ID
   * @param {number} routeId - Route ID
   * @returns {string} Color hex code
   */
  static getRouteColor(routeId) {
    const colors = {
      1: '#007bff', // Blue
      2: '#28a745', // Green
      3: '#dc3545', // Red
      4: '#ffc107', // Yellow
      5: '#6f42c1', // Purple
      6: '#fd7e14', // Orange
    };
    return colors[routeId] || '#6c757d'; // Default gray
  }

  /**
   * Handle API errors with enhanced error messages
   * @param {Error} error - Axios error
   * @returns {Error} Formatted error
   */
  static handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          return new Error(data?.message || 'Station not found');
        case 400:
          return new Error(data?.message || 'Invalid search parameters');
        case 500:
          return new Error('Server error occurred while searching routes');
        default:
          return new Error(data?.message || `API Error: ${status}`);
      }
    } else if (error.request) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        return new Error('Network error: Cannot connect to the server. Please check if the backend is running.');
      }
      return new Error('Network error: Unable to reach the server');
    } else {
      return new Error(`Request error: ${error.message}`);
    }
  }

  /**
   * Generate mock data for development/testing with new format
   * @param {number} sourceStationId 
   * @param {number} destinationStationId 
   * @returns {Object} Mock search results
   */
  static generateMockResults(sourceStationId, destinationStationId) {
    return {
      sourceStation: {
        id: sourceStationId,
        name: `Station ${sourceStationId}`,
        location: "Ho Chi Minh City"
      },
      destinationStation: {
        id: destinationStationId,
        name: `Station ${destinationStationId}`,
        location: "Ho Chi Minh City"
      },
      paths: [
        // Direct route
        {
          id: 1,
          routes: [
            {
              id: 1,
              name: "Line 1 Ben Thanh-Suoi Tien",
              color: "#007bff",
              ticketRule: {
                basePrice: 8000,
                pricePerKm: 2000
              },
              stations: [
                {
                  id: sourceStationId,
                  name: `Station ${sourceStationId}`,
                  location: "Ho Chi Minh City",
                  order: 1
                },
                {
                  id: destinationStationId,
                  name: `Station ${destinationStationId}`,
                  location: "Ho Chi Minh City",
                  order: 2
                }
              ]
            }
          ],
          segments: [
            {
              id: 1,
              routeId: 1,
              routeName: "Line 1 Ben Thanh-Suoi Tien",
              color: "#007bff",
              fromStation: {
                id: sourceStationId,
                name: `Station ${sourceStationId}`,
                location: "Ho Chi Minh City",
                openTime: "05:00",
                closeTime: "23:00"
              },
              toStation: {
                id: destinationStationId,
                name: `Station ${destinationStationId}`,
                location: "Ho Chi Minh City",
                openTime: "05:00",
                closeTime: "23:00"
              },
              distance: 8.5,
              duration: 15,
              price: this.calculateSegmentPrice(8.5, { basePrice: 8000, pricePerKm: 2000 })
            }
          ],
          totalDistance: 8.5,
          totalDuration: 15,
          totalPrice: this.calculateSegmentPrice(8.5, { basePrice: 8000, pricePerKm: 2000 }),
          transferCount: 0,
          isDirectRoute: true
        },
        // Route with transfer
        {
          id: 2,
          routes: [
            {
              id: 1,
              name: "Line 1 Ben Thanh-Suoi Tien",
              color: "#007bff",
              ticketRule: {
                basePrice: 8000,
                pricePerKm: 2000
              },
              stations: [
                {
                  id: sourceStationId,
                  name: `Station ${sourceStationId}`,
                  location: "Ho Chi Minh City",
                  order: 1
                },
                {
                  id: 3,
                  name: "Transfer Station",
                  location: "Ho Chi Minh City",
                  order: 2
                }
              ]
            },
            {
              id: 2,
              name: "Line 2 Cat Linh Ha Noi",
              color: "#28a745",
              ticketRule: {
                basePrice: 7500,
                pricePerKm: 1800
              },
              stations: [
                {
                  id: 3,
                  name: "Transfer Station",
                  location: "Ho Chi Minh City",
                  order: 3
                },
                {
                  id: destinationStationId,
                  name: `Station ${destinationStationId}`,
                  location: "Ho Chi Minh City",
                  order: 4
                }
              ]
            }
          ],
          segments: [
            {
              id: 2,
              routeId: 1,
              routeName: "Line 1 Ben Thanh-Suoi Tien",
              color: "#007bff",
              fromStation: {
                id: sourceStationId,
                name: `Station ${sourceStationId}`,
                location: "Ho Chi Minh City",
                openTime: "05:00",
                closeTime: "23:00"
              },
              toStation: {
                id: 3,
                name: "Transfer Station",
                location: "Ho Chi Minh City",
                openTime: "05:00",
                closeTime: "23:00"
              },
              distance: 6.2,
              duration: 12,
              price: this.calculateSegmentPrice(6.2, { basePrice: 8000, pricePerKm: 2000 })
            },
            {
              id: 3,
              routeId: 2,
              routeName: "Line 2 Cat Linh Ha Noi",
              color: "#28a745",
              fromStation: {
                id: 3,
                name: "Transfer Station",
                location: "Ho Chi Minh City",
                openTime: "05:00",
                closeTime: "23:00"
              },
              toStation: {
                id: destinationStationId,
                name: `Station ${destinationStationId}`,
                location: "Ho Chi Minh City",
                openTime: "05:00",
                closeTime: "23:00"
              },
              distance: 6.1,
              duration: 13,
              price: this.calculateSegmentPrice(6.1, { basePrice: 7500, pricePerKm: 1800 })
            }
          ],
          totalDistance: 12.3,
          totalDuration: 25,
          totalPrice: this.calculateSegmentPrice(6.2, { basePrice: 8000, pricePerKm: 2000 }) + 
                     this.calculateSegmentPrice(6.1, { basePrice: 7500, pricePerKm: 1800 }),
          transferCount: 1,
          isDirectRoute: false
        }
      ],
      totalPathsFound: 2
    };
  }
}

export default RouteSearchService;
