import { useState, useEffect } from "react";
import useTicket from "../../services/ticket";
import { Spinner, Table, Pagination, Form } from "react-bootstrap";



const HistoryTable = ({ ticketId, reloadTrigger }) => {
    const { getTicketHistory } = useTicket();
    const [historyLoading, setHistoryLoading] = useState(false);
    const [history, setHistory] = useState([]);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(() => {
        if (ticketId) {
            fetchHistory();
        }
    }, [ticketId, reloadTrigger]);

    // Reset to first page when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [history, itemsPerPage]);

    const fetchHistory = async () => {
        try {
            setHistoryLoading(true);
            const historyData = await getTicketHistory(ticketId);
            console.log(historyData);
            setHistory(historyData || []);
        } catch (error) {
            console.error('Error fetching history:', error);
            // If API doesn't exist yet, use mock data
        } finally {
            setHistoryLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    // Flatten history records to include both check-in and check-out rows
    const flattenedHistory = [];
    history.forEach((record) => {
        // Add check-in record
        flattenedHistory.push({
            ...record,
            type: 'checkin',
            time: record.checkIn,
            station: record.checkinStation,
            action: 'Check-in',
            badgeClass: 'bg-success'
        });
        
        // Add check-out record if exists
        if (record.checkOut) {
            flattenedHistory.push({
                ...record,
                type: 'checkout',
                time: record.checkOut,
                station: record.checkoutStation,
                action: 'Check-out',
                badgeClass: 'bg-warning'
            });
        }
    });
    
    // Sort by time (newest first)
    flattenedHistory.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    const currentItems = flattenedHistory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(flattenedHistory.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = parseInt(event.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Generate pagination items
    const renderPaginationItems = () => {
        const items = [];
        
        // Previous button
        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
        );

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            items.push(
                <Pagination.Item
                    key={1}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis1" />);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis2" />);
            }
            items.push(
                <Pagination.Item
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        // Next button
        items.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        );

        return items;
    };

    return (
        <>
            {/* History Table */}
            <div className="mt-5 history-table-container">
                <div className="history-table">
                    <div className="p-4">
                        <h4 className="mb-4 text-center">Lịch sử Check-in/Check-out</h4>
                        {flattenedHistory.length > 0 && (
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center">
                                    <small className="text-muted me-3">
                                        Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, flattenedHistory.length)} trong tổng số {flattenedHistory.length} bản ghi
                                    </small>
                                    <div className="d-flex align-items-center">
                                        <small className="text-muted me-2">Hiển thị:</small>
                                        <Form.Select 
                                            size="sm" 
                                            style={{ width: '80px' }}
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                        >
                                            <option value={6}>6</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {historyLoading ? (
                        <div className="text-center py-3">
                            <Spinner animation="border" size="sm" />
                            <p className="mt-2">Đang tải lịch sử...</p>
                        </div>
                    ) : flattenedHistory.length > 0 ? (
                        <>
                            <Table responsive striped hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Thời gian</th>
                                        <th>Tuyến</th>
                                        <th>Nhà ga</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((record, index) => (
                                        <tr key={`${record.id}-${record.type}-${index}`}>
                                            <td>{formatDateTime(record.time)}</td>
                                            <td>{record.routeName}</td>
                                            <td>{record.station}</td>
                                            <td>
                                                <span className={`badge ${record.badgeClass}`}>
                                                    {record.action}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        {renderPaginationItems()}
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted">Chưa có lịch sử check-in/check-out</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HistoryTable;