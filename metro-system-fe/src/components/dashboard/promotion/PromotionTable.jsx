import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import PromotionModal from './PromotionModal';
// import './promotion-table.css';

const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '';

const PAGE_SIZE = 5;

const PromotionTable = () => {
  const [promotions, setPromotions] = useState([]);
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/promotions?page=0&size=5');
      // Format lại ngày
    const formatDate = (isoString) => isoString.slice(0, 10).replace(/-/g, '-');
    const formattedData = response.data.data.content.map(item => ({
      ...item,
      fromDate: formatDate(item.fromDate),
      toDate: formatDate(item.toDate)
    }));
      setPromotions(formattedData);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [reload]);

  

  const handleUpdateBtn = (promotion) => {
    setSelectedPromotion(promotion);
    setShowModal(true);
  };

  const handleAddBtn = () => {
    setSelectedPromotion(null);
    setShowModal(true);
  };

  const handleSubmitPromotion = async (promotionData) => {
    try {
      
      if (promotionData.fromDate > promotionData.toDate) {
        alert('Start date cannot be greater than end date');
        return;
      }
      if (selectedPromotion) {
        // Update existing promotion
        const response = await axios.patch(
          `http://localhost:8080/api/v1/promotions/${selectedPromotion.promotionId}`,
          promotionData
        );       
        console.log("PromotionData", promotionData)
      } else {
        // Add new promotion
        const response = await axios.post(
          'http://localhost:8080/api/v1/promotions',
          promotionData
        );
      }
      setReload(r => !r);
      setShowModal(false);
      setSelectedPromotion(null);
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  const handleDeleteBtn = async (id) => {
    const response = await axios.delete(
      `http://localhost:8080/api/v1/promotions/${id}`,
    );
  };
  




  // Pagination
  const totalPages = Math.ceil(promotions.length / PAGE_SIZE);
  const paginatedPromotions = promotions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Container className="mt-4">
      
      <PromotionModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedPromotion(null);
        }}
        onSubmit={handleSubmitPromotion}
        promotion={selectedPromotion}
      />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Promotions</h2>
        <Button variant="primary" onClick={handleAddBtn}>
          <FaPlus className="me-2" />
          Add Promotion
        </Button>
      </div>
      <Table className="custom-table" responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Voucher Code</th>
            <th>Discount</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPromotions.map((promotion) => (
            <tr key={promotion.promotionId} className="table-row">
              <td className="align-items-center">
                {promotion.promotionName}
              </td>
              <td>{promotion.promotionCode}</td>
              <td>{promotion.promotionDiscount}%</td>
              <td>{promotion.fromDate}</td>
              <td>{promotion.toDate}</td>
              <td>
                <span className={`badge ${promotion.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                  {promotion.status}
                </span>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleUpdateBtn(promotion)}
                >
                  <FaEdit />
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteBtn(promotion.promotionId)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="pagination-container">
        <span className="me-3">Rows per page: {PAGE_SIZE}</span>
        <span className="me-3">
          {((currentPage - 1) * PAGE_SIZE) + 1}
          -
          {Math.min(currentPage * PAGE_SIZE, promotions.length)}
          {' '}of {promotions.length}
        </span>
        <Pagination size="sm">
          <Pagination.Prev
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          />
          <Pagination.Next
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </Container>
  );
};

export default PromotionTable;
