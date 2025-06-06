import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import PromotionModal from '../promotion/PromotionModal';
// import './promotion-table.css';




const PromotionTable = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/ticket-types');
      console.log(response.data.data);
      setTicketTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [reload]);

  

  const handleUpdateBtn = (ticketType) => {
    setSelectedType(ticketType);
    setShowModal(true);
  };

  const handleAddBtn = () => {
    setSelectedType(null);
    setShowModal(true);
  };

  // const handleSubmitPromotion = async (promotionData) => {
  //   try {
      
  //     if (promotionData.fromDate > promotionData.toDate) {
  //       alert('Start date cannot be greater than end date');
  //       return;
  //     }
  //     if (selectedPromotion) {
  //       // Update existing promotion
  //       const response = await axiosInstance.patch(
  //         `${API_ENDPOINTS.PROMOTIONS}/${selectedPromotion.promotionId}`,
  //         promotionData
  //       );       
  //       console.log("PromotionData", promotionData)
  //     } else {
  //       // Add new promotion
  //       const response = await axiosInstance.post(
  //         'https://682e8ef4746f8ca4a47d7191.mockapi.io/vouchers',
  //         promotionData
  //       );
  //     }
  //     setReload(r => !r);
  //     setShowModal(false);
  //     setSelectedPromotion(null);
  //   } catch (error) {
  //     console.error('Error adding promotion:', error);
  //   }
  // };

  const handleDeleteBtn = async (id) => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.PROMOTIONS}/${id}`,
    );
  };
  




  // Pagination
  

  return (
    <Container className="mt-4">
      
      {/* <PromotionModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedPromotion(null);
        }}
        onSubmit={handleSubmitPromotion}
        promotion={selectedPromotion}
      /> */}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Ticket Types</h2>
        <Button variant="primary" onClick={handleAddBtn}>
          <FaPlus className="me-2" />
          Add Ticket Type
        </Button>
      </div>
      <Table className="custom-table" responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Available Day</th>
            <th>Description</th>
            <th>Limit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ticketTypes.map((ticketType) => (
            <tr key={ticketType.ticketTypeId} className="table-row">
              <td className="align-items-center">
                {ticketType.ticketName}
              </td>
              <td>{ticketType.validityDays}</td>
              <td>{ticketType.description}</td>
              <td>{ticketType.usageLimit ? ticketType.usageLimit : 'Unlimited'}</td>
              <td>{ticketType.status}</td>
              <td>
                <span className={`badge ${ticketType.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                  {ticketType.status}
                </span>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleUpdateBtn(ticketType)}
                >
                  <FaEdit />
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteBtn(ticketType.ticketTypeId)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PromotionTable;
