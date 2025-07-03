import { useState, useEffect } from "react";
import useTicket from "../../services/ticket";
import { Spinner, Table } from "react-bootstrap";



const HistoryTable = ({ ticketId, reloadTrigger }) => {
    const { getTicketHistory } = useTicket();
    const [historyLoading, setHistoryLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (ticketId) {
            fetchHistory();
        }
    }, [ticketId, reloadTrigger]);

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
    return (
        <>
            {/* History Table */}
            <div className="mt-5 history-table-container">
                <div className="history-table">
                    <div className="p-4">
                        <h4 className="mb-4 text-center">Lịch sử Check-in/Check-out</h4>
                    </div>
                    {historyLoading ? (
                        <div className="text-center py-3">
                            <Spinner animation="border" size="sm" />
                            <p className="mt-2">Đang tải lịch sử...</p>
                        </div>
                    ) : history.length > 0 ? (
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
                                {history.map((record) => (
                                    // 1 history có thời gian checkin và checkout
                                    // có 1 row thể hiện check-in và 1 row thể hiện check-out
                                    // nếu không có checkout thì không hiển thị row check-out
                                    <>
                                    <tr key={`${record.id}-checkin`}>
                                        <td>{formatDateTime(record.checkIn)}</td>
                                        <td>{record.routeName}</td>
                                        <td>{record.checkinStation}</td>
                                        <td>
                                            <span className="badge bg-success">
                                                Check-in
                                            </span>
                                        </td>
                                    </tr>
                                    {record.checkOut && (
                                        <tr key={`${record.id}-checkout`}>
                                            <td>{formatDateTime(record.checkOut)}</td>
                                            <td>{record.routeName}</td>
                                            <td>{record.checkoutStation}</td>
                                            <td>
                                                <span className="badge bg-warning">
                                                    Check-out
                                                </span>
                                            </td>
                                        </tr>
                                    )}
                                    </>
                                ))}
                            </tbody>
                        </Table>
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