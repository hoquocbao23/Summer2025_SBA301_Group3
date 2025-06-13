import axiosInstance from '../config/axios';

const TICKET_RULE_ENDPOINTS = {
  TICKET_RULES: '/ticket-rules'
};

export class TicketRuleService {
  /**
   * Get all ticket rules
   * @returns {Promise<Object>} Ticket rules list response
   */
  static async getAllTicketRules() {
    try {
      const response = await axiosInstance.get(TICKET_RULE_ENDPOINTS.TICKET_RULES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get ticket rule by ID
   * @param {number} ruleId - Ticket rule ID
   * @returns {Promise<Object>} Ticket rule response
   */
  static async getTicketRuleById(ruleId) {
    try {
      const response = await axiosInstance.get(`${TICKET_RULE_ENDPOINTS.TICKET_RULES}/${ruleId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new ticket rule
   * @param {Object} ruleData - Ticket rule data
   * @returns {Promise<Object>} Created ticket rule response
   */
  static async createTicketRule(ruleData) {
    try {
      const response = await axiosInstance.post(TICKET_RULE_ENDPOINTS.TICKET_RULES, ruleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update existing ticket rule
   * @param {number} ruleId - Ticket rule ID
   * @param {Object} ruleData - Updated ticket rule data
   * @returns {Promise<Object>} Updated ticket rule response
   */
  static async updateTicketRule(ruleId, ruleData) {
    try {
      const response = await axiosInstance.put(`${TICKET_RULE_ENDPOINTS.TICKET_RULES}/${ruleId}`, ruleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete ticket rule
   * @param {number} ruleId - Ticket rule ID
   * @returns {Promise<Object>} Delete response
   */
  static async deleteTicketRule(ruleId) {
    try {
      const response = await axiosInstance.delete(`${TICKET_RULE_ENDPOINTS.TICKET_RULES}/${ruleId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get active ticket rules
   * @returns {Promise<Object>} Active ticket rules response
   */
  static async getActiveTicketRules() {
    try {
      const response = await axiosInstance.get(`${TICKET_RULE_ENDPOINTS.TICKET_RULES}/active`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate ticket price for a route
   * @param {number} ruleId - Ticket rule ID
   * @param {number} distance - Route distance in km
   * @returns {Promise<Object>} Price calculation response
   */
  static async calculatePrice(ruleId, distance) {
    try {
      const response = await axiosInstance.post(`${TICKET_RULE_ENDPOINTS.TICKET_RULES}/${ruleId}/calculate`, {
        distance
      });
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

export default TicketRuleService;