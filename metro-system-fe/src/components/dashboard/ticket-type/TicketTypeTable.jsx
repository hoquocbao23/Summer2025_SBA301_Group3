import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axiosInstance from '../../../config/axios';
import TicketTypeModal from './TicketTypeModal';
// import './promotion-table.css';




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
  




  // Pagination
  

  return (
    <Container className="mt-4">
      
      <TicketTypeModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedTicketType(null);
        }}
        onSubmit={handleSubmitTicketType}
        ticketType={selectedTicketType}
      />

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
              <td>{ticketType.usageLimit ? 'Limited' : 'Unlimited'}</td>
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

export default TicketTypeTable;
