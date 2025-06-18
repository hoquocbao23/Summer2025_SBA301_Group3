import axiosInstance from '../config/axios';

const ROUTE_ENDPOINTS = {
  ROUTES: '/routes',
  ROUTE_STATIONS: '/routes/stations',
  SEARCH: '/routes/search',
  BY_TICKET_RULE: '/routes/by-ticket-rule',
  BY_NAME: '/routes/by-name',
  EXISTS: '/routes/exists'
};

export class RouteService {
  // Basic Route Management

  /**
   * Get all routes
   * @returns {Promise<Object>} Routes list response
   */
  static async getAllRoutes() {
    try {
      const response = await axiosInstance.get(ROUTE_ENDPOINTS.ROUTES);
      console.log('All routes fetched successfully:', response);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get route by ID
   * @param {number} routeId - Route ID
   * @returns {Promise<Object>} Route response
   */
  static async getRouteById(routeId) {
    try {
      const response = await axiosInstance.get(`${ROUTE_ENDPOINTS.ROUTES}/${routeId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new route
   * @param {Object} routeData - Route data
   * @returns {Promise<Object>} Created route response
   */
  static async createRoute(routeData) {
    try {
      const payload = this.transformToApiFormat(routeData);
      const response = await axiosInstance.post(ROUTE_ENDPOINTS.ROUTES, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update existing route
   * @param {number} routeId - Route ID
   * @param {Object} routeData - Updated route data
   * @returns {Promise<Object>} Updated route response
   */
  static async updateRoute(routeId, routeData) {
    try {
      const payload = this.transformToApiFormat(routeData);
      const response = await axiosInstance.put(`${ROUTE_ENDPOINTS.ROUTES}/${routeId}`, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * deactivate route
   * @param {number} routeId - Route ID
   * @returns {Promise<Object>} deactivate response
   */
  static async deactivateRoute(routeId) {
    try {
      const response = await axiosInstance.put(`${ROUTE_ENDPOINTS.ROUTES}/${routeId}/deactivate`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * activate route
   * @param {number} routeId - Route ID
   * @returns {Promise<Object>} activate response
   */
  static async activateRoute(routeId) {
    try {
      const response = await axiosInstance.put(`${ROUTE_ENDPOINTS.ROUTES}/${routeId}/activate`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Station Route Management

  /**
   * Get route with stations
   * @param {number} routeId - Route ID
   * @returns {Promise<Object>} Route with stations response
   */
  static async getRouteWithStations(routeId) {
    try {
      const response = await axiosInstance.get(`${ROUTE_ENDPOINTS.ROUTES}/${routeId}/stations`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Add stations to route
   * @param {number} routeId - Route ID
   * @param {Array} stations - Array of station objects
   * @returns {Promise<Object>} Success response
   */
  static async addStationsToRoute(routeId, stations) {
    try {
      const payload = {
        routeId,
        stations: stations.map(station => ({
          stationId: station.stationId,
          stationOrder: station.order,
          distanceToNext: station.distanceFromPrevious || 0
        }))
      };
      const response = await axiosInstance.post(ROUTE_ENDPOINTS.ROUTE_STATIONS, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update route stations (replace all)
   * @param {number} routeId - Route ID
   * @param {Array} stations - Array of station objects
   * @returns {Promise<Object>} Success response
   */
  static async updateRouteStations(routeId, stations) {
    try {
      const payload = {
        routeId,
        stations: stations.map(station => ({
          stationId: station.stationId,
          stationOrder: station.order,
          distanceToNext: station.distanceToNext || 0
        }))
      };
      const response = await axiosInstance.put(ROUTE_ENDPOINTS.ROUTE_STATIONS, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Remove all stations from route
   * @param {number} routeId - Route ID
   * @returns {Promise<Object>} Success response
   */
  static async removeAllStationsFromRoute(routeId) {
    try {
      const response = await axiosInstance.delete(`${ROUTE_ENDPOINTS.ROUTES}/${routeId}/stations`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search and Utility Functions

  /**
   * Search routes by name keyword
   * @param {string} keyword - Search keyword
   * @returns {Promise<Object>} Search results
   */
  static async searchRoutesByName(keyword) {
    try {
      const response = await axiosInstance.get(`${ROUTE_ENDPOINTS.SEARCH}?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get routes by ticket rule
   * @param {number} ticketRuleId - Ticket rule ID
   * @returns {Promise<Object>} Routes response
   */
  static async getRoutesByTicketRule(ticketRuleId) {
    try {
      const response = await axiosInstance.get(`${ROUTE_ENDPOINTS.BY_TICKET_RULE}/${ticketRuleId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get route by exact name
   * @param {string} routeName - Route name
   * @returns {Promise<Object>} Route response
   */
  static async getRouteByName(routeName) {
    try {
      const response = await axiosInstance.get(`${ROUTE_ENDPOINTS.BY_NAME}/${encodeURIComponent(routeName)}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check if route name exists
   * @param {string} routeName - Route name to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  static async checkRouteNameExists(routeName) {
    try {
      const response = await axiosInstance.get(`${ROUTE_ENDPOINTS.EXISTS}/${encodeURIComponent(routeName)}`);
      return response.data.exists || false;
    } catch (error) {
      // If route doesn't exist, API might return 404, which is expected
      if (error.status === 404) {
        return false;
      }
      throw this.handleError(error);
    }
  }

  // Helper methods

  /**
   * Transform frontend route data to API format
   * @param {Object} routeData - Frontend route data
   * @returns {Object} API-formatted route data
   */
  static transformToApiFormat(routeData) {
    return {
      routeName: routeData.routeName?.trim(),
      routeDescription: routeData.routeDescription?.trim(),
      estimatedDuration: parseInt(routeData.estimatedDuration) || 1,
      frequencyMinutes: parseInt(routeData.frequencyMinutes) || 1,
      operatingHours: routeData.operatingHours?.trim(),
      status: routeData.status,
      color: routeData.color,
      ruleId: parseInt(routeData.ruleId) || 1
    };
  }

  /**
   * Transform API route data to frontend format
   * @param {Object} apiRouteData - API route data
   * @returns {Object} Frontend-formatted route data
   */
  static transformFromApiFormat(apiRouteData) {
    const getTicketRulesArray = (ticketRule) => {
      if (!ticketRule) return [];
      if (Array.isArray(ticketRule)) return ticketRule;
      // If it's a single object, wrap it in an array
      if (typeof ticketRule === 'object') return [ticketRule];
      return [];
    };
    const ticketRulesArray = getTicketRulesArray(apiRouteData.ticketRule);
    
    return {
      routeId: apiRouteData.routeId,
      routeName: apiRouteData.routeName,
      routeDescription: apiRouteData.routeDescription,
      status: apiRouteData.status || 'ACTIVE',
      color: '#007bff', // Default color, can be customized
      totalDistance: apiRouteData.totalDistance || 0,
      estimatedDuration: apiRouteData.estimatedDuration || 0,
      operatingHours: apiRouteData.operatingHours,
      frequencyMinutes: `${apiRouteData.frequencyMinutes || 5}`,
      ruleId: ticketRulesArray.length > 0 ? ticketRulesArray[0].ruleId : 1,
      ticketRule: ticketRulesArray.map(rule => ({
        ruleId: rule.ruleId,
        ruleName: rule.ruleName,
        pricePerKm: rule.pricePerKm,
        description: rule.basePrice,
        status: rule.status,
        isDelete: rule.isDelete
      })),
      stations: (apiRouteData.stations || []).map(station => ({
        stationId: station.stationId,
        order: station.stationOrder,
        distanceFromPrevious: station.distanceToNext || 0
      }))
    };
  }

  /**
   * Parse frequency string to minutes
   * @param {string} frequency - Frequency string (e.g., "5 minutes")
   * @returns {number} Frequency in minutes
   */
  static parseFrequency(frequency) {
    if (typeof frequency === 'number') return frequency;
    if (typeof frequency === 'string') {
      const match = frequency.match(/(\d+)/);
      return match ? parseInt(match[1]) : 5;
    }
    return 5; // Default
  }

  /**
   * Handle API errors with enhanced CORS detection
   * @param {Error} error - Axios error
   * @returns {Error} Formatted error
   */
  static handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || `API Error: ${status}`;
      const apiError = new Error(message);
      apiError.status = status;
      apiError.data = data;
      return apiError;
    } else if (error.request) {
      // Request was made but no response received (likely CORS or network issue)
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        return new Error('CORS Error: Backend server không cho phép truy cập từ frontend. Vui lòng kiểm tra cấu hình CORS trên server hoặc sử dụng proxy.');
      }
      return new Error('Network error: Không thể kết nối tới server. Vui lòng kiểm tra backend đã chạy chưa.');
    } else {
      // Something else happened
      return new Error(`Request error: ${error.message}`);
    }
  }
}

export default RouteService;