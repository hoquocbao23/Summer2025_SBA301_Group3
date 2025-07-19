import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Pagination, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axiosInstance from '../../../config/axios';
import PromotionModal from './PromotionModal';
import './PromotionTable.css';

const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '';

const PAGE_SIZE = 5;

const PromotionTable = () => {
  const [promotions, setPromotions] = useState([]);
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPromotions = async () => {
    try {
      const response = await axiosInstance.get(`/promotions?page=${currentPage - 1}&size=${PAGE_SIZE}`);
      // Format lại ngày
      const formatDate = (isoString) => isoString.slice(0, 10).replace(/-/g, '-');
      const formattedData = response.data.data.content.map(item => ({
        ...item,
        fromDate: formatDate(item.fromDate),
        toDate: formatDate(item.toDate)
      }));
      setPromotions(formattedData);
      setTotalElements(response.data.data.totalElements);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [reload, currentPage]);

  // Calculate stats
  const totalPromotions = totalElements;
  const activePromotions = promotions.filter(p => p.status === 'ACTIVE').length;
  const inactivePromotions = promotions.filter(p => p.status === 'INACTIVE').length;
  const avgDiscount = promotions.length > 0 
    ? Math.round(promotions.reduce((sum, p) => sum + p.promotionDiscount, 0) / promotions.length)
    : 0;

  const handleUpdateBtn = (promotion) => {
    setSelectedPromotion(promotion);
    console.log("Selected Promotion", promotion);
    setShowModal(true);
  };

  const handleAddBtn = () => {
    resetForm();
    setSelectedPromotion(null);
    setShowModal(true);
  };

  const resetForm = () => {
    // Reset form data to initial state
    setSelectedPromotion(null);
    // You can also add any other form reset logic here if needed
    
  };

  const handleSubmitPromotion = async (promotionData) => {
    try {
      if (promotionData.fromDate > promotionData.toDate) {
        alert('Start date cannot be greater than end date');
        return;
      }
      if (selectedPromotion) {
         await axiosInstance.patch(
          `/promotions/${selectedPromotion.promotionId}`,
          promotionData,
        );
      }else {
         await axiosInstance.post(
          '/promotions',
          promotionData,
        );
      }
      setReload(r => !r);
      setShowModal(false);
      setSelectedPromotion(null);
    } catch (error) {
        alert(`${error.response?.data?.message || error.message || 'Failed to submit promotion'}`);
    }
  };

  const handleDeleteBtn = async (id) => {
    try {
      await axiosInstance.delete(`/promotions/${id}`, {
      });
      setReload(r => !r);
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };
  
  return (
    <div className="promotion-dashboard">
      <PromotionModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedPromotion(null);
        }}
        onSubmit={handleSubmitPromotion}
        promotion={selectedPromotion}
      />

      {/* Header */}
      <div className="promotion-header">
        <div>
          <h2 className="promotion-header-title">
            Quản lý khuyến mãi
          </h2>
          <p className="promotion-header-subtitle">Quản lý các chương trình khuyến mãi và voucher</p>
        </div>
        <button className="promotion-add-btn" onClick={handleAddBtn}>
          + Thêm khuyến mãi
        </button>
      </div>

      {/* Stats Cards */}
      <div className="promotion-stats-grid">
        <div className="promotion-stat-card">
          <div className="promotion-stat-content">
            <div>
              <p className="promotion-stat-label">
                TỔNG KHUYẾN MÃI
              </p>
              <h3 className="promotion-stat-value total">
                {totalPromotions}
              </h3>
            </div>
            <div className="promotion-stat-icon total">
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="promotion-stat-card">
          <div className="promotion-stat-content">
            <div>
              <p className="promotion-stat-label">
                KHUYẾN MÃI HOẠT ĐỘNG
              </p>
              <h3 className="promotion-stat-value active">
                {activePromotions}
              </h3>
            </div>
            <div className="promotion-stat-icon active">
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="promotion-stat-card">
          <div className="promotion-stat-content">
            <div>
              <p className="promotion-stat-label">
                KHUYẾN MÃI KHÔNG HOẠT ĐỘNG
              </p>
              <h3 className="promotion-stat-value inactive">
                {inactivePromotions}
              </h3>
            </div>
            <div className="promotion-stat-icon inactive">
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="promotion-stat-card">
          <div className="promotion-stat-content">
            <div>
              <p className="promotion-stat-label">
                GIẢM GIÁ TRUNG BÌNH
              </p>
              <h3 className="promotion-stat-value avg">
                {avgDiscount}%
              </h3>
            </div>
            <div className="promotion-stat-icon avg">
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5 5 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
                <path d="M14 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5 5 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="promotion-table-section">
        <h4>
          Danh sách khuyến mãi
        </h4>

        <div className="promotion-table-container">
          <table className="promotion-table">
            <thead>
              <tr>
                <th>Tên khuyến mãi</th>
                <th>Mã voucher</th>
                <th>Giảm giá</th>
                <th>Từ ngày</th>
                <th>Đến ngày</th>
                <th>Loại vé</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion, index) => (
                <tr key={promotion.promotionId}>
                  <td className="data">
                    {promotion.promotionName}
                  </td>
                  <td className="muted">
                    {promotion.promotionCode}
                  </td>
                  <td className="muted">
                    {promotion.promotionDiscount}%
                  </td>
                  <td className="muted">
                    {promotion.fromDate}
                  </td>
                  <td className="muted">
                    {promotion.toDate}
                  </td>
                  <td className="muted">
                    {promotion.ticketType.ticketName}
                  </td>
                  <td>
                    <span className={`promotion-status-badge ${promotion.status === "ACTIVE" ? "active" : "inactive"}`}>
                      {promotion.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td>
                    <div className="promotion-actions">
                      <button
                        className="promotion-action-btn edit"
                        onClick={() => handleUpdateBtn(promotion)}
                      >
                        <FaEdit size={16} />
                      </button>
                     
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="promotion-pagination">
            <div>
              <span className="promotion-pagination-info">
                Hiển thị {((currentPage - 1) * PAGE_SIZE) + 1}-{Math.min(currentPage * PAGE_SIZE, totalElements)} của {totalElements} khuyến mãi
              </span>
            </div>
            <div className="promotion-pagination-controls">
              <button
                className={`promotion-pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`promotion-pagination-btn ${idx + 1 === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className={`promotion-pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionTable;
