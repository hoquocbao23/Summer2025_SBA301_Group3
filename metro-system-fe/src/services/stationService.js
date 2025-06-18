import axiosInstance from '../config/axios';

const STATION_ENDPOINTS = {
  STATIONS: '/stations'
};

export class StationService {
  /**
   * Get all stations
   * @returns {Promise<Object>} Stations list response
   */
  static async getAllStations() {
    try {
      const response = await axiosInstance.get(STATION_ENDPOINTS.STATIONS);
      console.log('Stations response:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get station by ID
   * @param {number} stationId - Station ID
   * @returns {Promise<Object>} Station response
   */
  static async getStationById(stationId) {
    try {
      const response = await axiosInstance.get(`${STATION_ENDPOINTS.STATIONS}/${stationId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new station
   * @param {Object} stationData - Station data
   * @returns {Promise<Object>} Created station response
   */
  static async createStation(stationData) {
    try {
      const response = await axiosInstance.post(STATION_ENDPOINTS.STATIONS, stationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update existing station
   * @param {number} stationId - Station ID
   * @param {Object} stationData - Updated station data
   * @returns {Promise<Object>} Updated station response
   */
  static async updateStation(stationId, stationData) {
    try {
      const response = await axiosInstance.put(`${STATION_ENDPOINTS.STATIONS}/${stationId}`, stationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete station
   * @param {number} stationId - Station ID
   * @returns {Promise<Object>} Delete response
   */
  static async deleteStation(stationId) {
    try {
      const response = await axiosInstance.delete(`${STATION_ENDPOINTS.STATIONS}/${stationId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search stations by name
   * @param {string} keyword - Search keyword
   * @returns {Promise<Object>} Search results
   */
  static async searchStations(keyword) {
    try {
      const response = await axiosInstance.get(`${STATION_ENDPOINTS.STATIONS}/search?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors with enhanced CORS detection
   * @param {Error} error - Axios error
   * @returns {Error} Formatted error
   */
  static handleError(error) {
    if (error.response) {
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
      return new Error(`Request error: ${error.message}`);
    }
  }
}

export default StationService;