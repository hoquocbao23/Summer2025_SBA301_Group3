import axiosInstance from '../config/axios';

const TICKET_ENDPOINTS = {
  TICKETS: '/tickets'
};

export default function useTicket() {
  const getTicketById = async (ticketId) => {
    try {
      const response = await axiosInstance.get(`${TICKET_ENDPOINTS.TICKETS}/${ticketId}`);
      return response.data.data;
    } catch (error) {
      throw error;  
    }
  };

  const getTicketHistory = async (ticketId) => {
    try {
      const response = await axiosInstance.get(`${TICKET_ENDPOINTS.TICKETS}/history/${ticketId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const checkInTicket = async (ticketId) => {
    try {
      const response = await axiosInstance.post(`${TICKET_ENDPOINTS.TICKETS}/check-in?ticketId=${ticketId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const checkOutTicket = async (ticketId) => {
    try {
      const response = await axiosInstance.post(`${TICKET_ENDPOINTS.TICKETS}/check-out?ticketId=${ticketId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { getTicketById, getTicketHistory, checkInTicket, checkOutTicket };
}