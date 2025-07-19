import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Pagination, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axiosInstance from '../../../config/axios';
import TicketTypeModal from './TicketTypeModal';
import './TicketTypeTable.css';

const TicketTypeTable = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [reload, setReload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState(null);

  const fetchTicketTypes = async () => {
    try {
      const response = await axiosInstance.get('/ticket-types');
      console.log(response.data.data);
      setTicketTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching ticket types:', error);
    }
  };

  useEffect(() => {
    fetchTicketTypes();
  }, [reload]);

  // Calculate stats
  const totalTicketTypes = ticketTypes.length;
  const activeTicketTypes = ticketTypes.filter(t => t.status === 'ACTIVE').length;
  const inactiveTicketTypes = ticketTypes.filter(t => t.status === 'INACTIVE').length;
  const limitedTicketTypes = ticketTypes.filter(t => t.usageLimit).length;

  const handleUpdateBtn = (ticketType) => {
    setSelectedTicketType(ticketType);
    setShowModal(true);
  };

  const handleAddBtn = () => {
    setSelectedTicketType(null);
    setShowModal(true);
  };

  const handleSubmitTicketType = async (ticketTypeData) => {
    try {
      if (selectedTicketType) {
         await axiosInstance.patch(
          `/ticket-types/${selectedTicketType.ticketTypeId}`,
          ticketTypeData
        );       
      }else {
         await axiosInstance.post(
          '/ticket-types',
          ticketTypeData
        );
      }
      setReload(r => !r);
      setShowModal(false);
      setSelectedTicketType(null);
    } catch (error) {
      alert(`${error.response?.data?.message || error.message || 'Failed to submit ticket type'}`);
    }
  };

  const handleDeleteBtn = async (id) => {
    try {
      await axiosInstance.delete(`/ticket-types/${id}`);
      setReload(r => !r);
    } catch (error) {
      console.error('Error deleting ticket type:', error);
    }
  };

  return (
    <div className="ticket-type-dashboard">
      <TicketTypeModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedTicketType(null);
        }}
        onSubmit={handleSubmitTicketType}
        ticketType={selectedTicketType}
      />

      {/* Header */}
      <div className="ticket-type-header">
        <div>
          <h2 className="ticket-type-header-title">
            Quản lý loại vé
          </h2>
          <p className="ticket-type-header-subtitle">Quản lý các loại vé và cấu hình của chúng</p>
        </div>
        <button className="ticket-type-add-btn" onClick={handleAddBtn}>
          + Thêm loại vé
        </button>
      </div>

      {/* Stats Cards */}
      <div className="ticket-type-stats-grid">
        <div className="ticket-type-stat-card">
          <div className="ticket-type-stat-content">
            <div>
              <p className="ticket-type-stat-label">
                TỔNG LOẠI VÉ
              </p>
              <h3 className="ticket-type-stat-value total">
                {totalTicketTypes}
              </h3>
            </div>
            <div className="ticket-type-stat-icon total">
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="ticket-type-stat-card">
          <div className="ticket-type-stat-content">
            <div>
              <p className="ticket-type-stat-label">
                LOẠI VÉ HOẠT ĐỘNG
              </p>
              <h3 className="ticket-type-stat-value active">
                {activeTicketTypes}
              </h3>
            </div>
            <div className="ticket-type-stat-icon active">
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="ticket-type-stat-card">
          <div className="ticket-type-stat-content">
            <div>
              <p className="ticket-type-stat-label">
                LOẠI VÉ KHÔNG HOẠT ĐỘNG
              </p>
              <h3 className="ticket-type-stat-value inactive">
                {inactiveTicketTypes}
              </h3>
            </div>
            <div className="ticket-type-stat-icon inactive">
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="ticket-type-stat-card">
          <div className="ticket-type-stat-content">
            <div>
              <p className="ticket-type-stat-label">
                LOẠI VÉ CÓ GIỚI HẠN
              </p>
              <h3 className="ticket-type-stat-value limited">
                {limitedTicketTypes}
              </h3>
            </div>
            <div className="ticket-type-stat-icon limited">
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5 5 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
                <path d="M14 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5 5 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ticket-type-table-section">
        <h4>
          Danh sách loại vé
        </h4>

        <div className="ticket-type-table-container">
          <table className="ticket-type-table">
            <thead>
              <tr>
                <th>Tên loại vé</th>
                <th>Số ngày hiệu lực</th>
                <th>Mô tả</th>
                <th>Giới hạn sử dụng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {ticketTypes.map((ticketType) => (
                <tr key={ticketType.ticketTypeId}>
                  <td className="data">
                    {ticketType.ticketName}
                  </td>
                  <td className="muted">
                    {ticketType.validityDays} ngày
                  </td>
                  <td className="muted">
                    {ticketType.description}
                  </td>
                  <td>
                    <span className={`ticket-type-limit-badge ${ticketType.usageLimit ? 'limited' : 'unlimited'}`}>
                      {ticketType.usageLimit ? 'Có giới hạn' : 'Không giới hạn'}
                    </span>
                  </td>
                  <td>
                    <span className={`ticket-type-status-badge ${ticketType.status === "ACTIVE" ? "active" : "inactive"}`}>
                      {ticketType.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td>
                    <div className="ticket-type-actions">
                      <button
                        className="ticket-type-action-btn edit"
                        onClick={() => handleUpdateBtn(ticketType)}
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        className="ticket-type-action-btn delete"
                        onClick={() => handleDeleteBtn(ticketType.ticketTypeId)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketTypeTable;
