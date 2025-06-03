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
      const response = await axios.get('https://682e8ef4746f8ca4a47d7191.mockapi.io/vouchers');
      // Format lại ngày
    const formatDate = (isoString) => isoString.slice(0, 10).replace(/-/g, '-');
    const formattedData = response.data.map(item => ({
      ...item,
      from: formatDate(item.from),
      to: formatDate(item.to)
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
    console.log(promotion);
    setShowModal(true);
  };

  const handleAddBtn = () => {
    setSelectedPromotion(null);
    setShowModal(true);
  };

  const handleSubmitPromotion = async (promotionData) => {
    try {
      if (selectedPromotion) {
        // Update existing promotion
        const response = await axios.put(
          `https://682e8ef4746f8ca4a47d7191.mockapi.io/vouchers/${selectedPromotion.voucher_id}`,
          promotionData
        );       
      } else {
        // Add new promotion
        const response = await axios.post(
          'https://682e8ef4746f8ca4a47d7191.mockapi.io/vouchers',
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
      `https://682e8ef4746f8ca4a47d7191.mockapi.io/vouchers/${id}`,
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
            <tr key={promotion.voucher_id} className="table-row">
              <td className="align-items-center">
                {promotion.voucher_name}
              </td>
              <td>{promotion.voucher_code}</td>
              <td>{promotion.voucher_discount}%</td>
              <td>{promotion.from}</td>
              <td>{promotion.to}</td>
              <td>{promotion.status ? 'Active' : 'Inactive'}</td>
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
                  onClick={() => handleDeleteBtn(promotion.voucher_id)}
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
