import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axiosInstance from '../../../config/axios';
import PromotionModal from './PromotionModal';
// import axios from 'axios';


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

  

  const handleUpdateBtn = (promotion) => {
    setSelectedPromotion(promotion);
    console.log("Selected Promotion", promotion);
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
        await axiosInstance.patch(
          `/promotions/${selectedPromotion.promotionId}`,
          promotionData,
          {
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      } else {
        // Add new promotion
        await axiosInstance.post(
          '/promotions',
          promotionData,
          {
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }
      setReload(r => !r);
      setShowModal(false);
      setSelectedPromotion(null);
    } catch (error) {
      console.error('Error submitting promotion:', error);
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
            <th>Ticket Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion.promotionId} className="table-row">
              <td className="align-items-center">
                {promotion.promotionName}
              </td>
              <td>{promotion.promotionCode}</td>
              <td>{promotion.promotionDiscount}%</td>
              <td>{promotion.fromDate}</td>
              <td>{promotion.toDate}</td>
              <td>
                {promotion.ticketType.ticketName}
              </td>
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

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <span className="me-3">Rows per page: {PAGE_SIZE}</span>
          <span>
            {((currentPage - 1) * PAGE_SIZE) + 1}
            -
            {Math.min(currentPage * PAGE_SIZE, totalElements)}
            {' '}of {totalElements}
          </span>
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
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
