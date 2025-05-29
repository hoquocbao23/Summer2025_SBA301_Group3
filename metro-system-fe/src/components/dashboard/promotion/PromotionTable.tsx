import React, { useState } from 'react';
import { Table, Button, Container, Form, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Promotion {
  voucher_id: number;
  voucher_name: string;
  voucher_code: string;
  voucher_discount: number;
  from: Date;
  to: Date;
  status: string;
  avatarUrl?: string; // optional avatar
}

const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '';

const PAGE_SIZE = 5;

const PromotionTable = () => {
  // Dummy data for demo
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      voucher_id: 1,
      voucher_name: 'Alcides Antonio',
      voucher_code: 'PROMO1',
      voucher_discount: 10,
      from: new Date('2024-03-01'),
      to: new Date('2024-03-31'),
      status: 'Active',
      avatarUrl: '',
    },
    {
      voucher_id: 2,
      voucher_name: 'Marcus Finn',
      voucher_code: 'PROMO2',
      voucher_discount: 15,
      from: new Date('2024-03-01'),
      to: new Date('2024-03-31'),
      status: 'Inactive',
      avatarUrl: '',
    },
    {
      voucher_id: 3,
      voucher_name: 'Jie Yan',
      voucher_code: 'PROMO3',
      voucher_discount: 20,
      from: new Date('2024-03-01'),
      to: new Date('2024-03-31'),
      status: 'Active',
      avatarUrl: '',
    },
    {
      voucher_id: 4,
      voucher_name: 'Nasimiyu Danai',
      voucher_code: 'PROMO4',
      voucher_discount: 25,
      from: new Date('2024-03-01'),
      to: new Date('2024-03-31'),
      status: 'Active',
      avatarUrl: '',
    },
    {
      voucher_id: 5,
      voucher_name: 'Iulia Albu',
      voucher_code: 'PROMO5',
      voucher_discount: 30,
      from: new Date('2024-03-01'),
      to: new Date('2024-03-31'),
      status: 'Inactive',
      avatarUrl: '',
    },
  ]);
  const [selected, setSelected] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (id: number): void => {
    setPromotions(promotions.filter(promo => promo.voucher_id !== id));
  };

  const handleUpdate = (id: number): void => {
    console.log('Update promotion with id:', id);
  };

  const handleAdd = (): void => {
    console.log('Add new promotion');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(promotions.map(p => p.voucher_id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: number) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  // Pagination
  const totalPages = Math.ceil(promotions.length / PAGE_SIZE);
  const paginatedPromotions = promotions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Container className="mt-4">
      <style>{`
        .custom-table {
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .custom-table thead tr {
          background: #f7f7fa;
        }
        .custom-table th {
          font-weight: 600;
          color: #6b7280;
          border-bottom: none;
        }
        .custom-table td {
          vertical-align: middle;
          background: #fff;
          border-top: none;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0e7ef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #4b5563;
          margin-right: 12px;
          font-size: 1.1rem;
        }
        .table-row {
          transition: background 0.2s;
        }
        .table-row:hover {
          background: #f3f4f6;
        }
        .pagination-container {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 16px 0 0 0;
        }
      `}</style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Promotions</h2>
        <Button variant="primary" onClick={handleAdd}>
          <FaPlus className="me-2" />
          Add Promotion
        </Button>
      </div>
      <Table className="custom-table" responsive>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={selected.length === promotions.length && promotions.length > 0}
                onChange={handleSelectAll}
              />
            </th>
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
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selected.includes(promotion.voucher_id)}
                  onChange={() => handleSelect(promotion.voucher_id)}
                />
              </td>
              <td className="d-flex align-items-center">
                {promotion.avatarUrl ? (
                  <img src={promotion.avatarUrl} alt={promotion.voucher_name} className="avatar" />
                ) : (
                  <span className="avatar">{getInitial(promotion.voucher_name)}</span>
                )}
                <span>{promotion.voucher_name}</span>
              </td>
              <td>{promotion.voucher_code}</td>
              <td>{promotion.voucher_discount}%</td>
              <td>{promotion.from.toLocaleDateString()}</td>
              <td>{promotion.to.toLocaleDateString()}</td>
              <td>{promotion.status}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleUpdate(promotion.voucher_id)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(promotion.voucher_id)}
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
