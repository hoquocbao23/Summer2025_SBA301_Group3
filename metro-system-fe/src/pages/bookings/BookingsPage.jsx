import React, { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    Clock,
    Train,
    User,
    CreditCard,
    Ticket,
    ArrowRight,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    XCircle,
    Eye,
    QrCode,
    Users,
    DollarSign,
    Tag
} from 'lucide-react';
import axiosInstance from '../../config/axios';
import './BookingsPage.css';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.get('/account/ticket');

            if (response.data?.status === 200) {
                setBookings(response.data.data || []);
            } else {
                setError('Không thể tải dữ liệu booking');
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            if (err.response?.status === 401) {
                setError('Vui lòng đăng nhập để xem booking');
            } else if (err.response?.status === 404) {
                setError('Không tìm thấy booking nào');
            } else {
                setError('Có lỗi xảy ra khi tải dữ liệu');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return 'status-active';
            case 'USED':
                return 'status-used';
            case 'EXPIRED':
                return 'status-expired';
            default:
                return 'status-inactive';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return <CheckCircle size={16} />;
            case 'USED':
                return <Eye size={16} />;
            case 'EXPIRED':
                return <XCircle size={16} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    const handleShowDetails = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBooking(null);
    };

    if (loading) {
        return (
            <div className="bookings-loading">
                <div className="loading-spinner">
                    <RefreshCw size={48} className="spin" />
                    <h3>Đang tải booking...</h3>
                    <p>Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bookings-error">
                <div className="error-content">
                    <AlertCircle size={64} className="error-icon" />
                    <h2>Có lỗi xảy ra</h2>
                    <p>{error}</p>
                    <button className="btn-retry" onClick={fetchBookings}>
                        <RefreshCw size={20} />
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bookings-page">
            <div className="bookings-container">
                {/* Header */}
                <div className="bookings-header">
                    <div className="header-content">
                        <h1 className="page-title">
                            <Ticket size={28} />
                            Booking của tôi
                        </h1>
                        <p className="page-subtitle">
                            Quản lý và theo dõi các chuyến đi của bạn
                        </p>
                    </div>
                    <button className="btn-refresh" onClick={fetchBookings} disabled={loading}>
                        <RefreshCw size={20} className={loading ? 'spin' : ''} />
                        Làm mới
                    </button>
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="empty-state">
                        <Ticket size={80} className="empty-icon" />
                        <h3>Chưa có booking nào</h3>
                        <p>Hãy đặt vé để xem booking tại đây</p>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <div key={booking.bookingId} className="booking-card">
                                <div className="booking-header">
                                    <div className="booking-info">
                                        <h3 className="booking-title">
                                            Booking #{booking.bookingId}
                                        </h3>
                                        <div className="booking-meta">
                                            <span className="booking-date">
                                                <Calendar size={16} />
                                                {formatDateTime(booking.purchaseTime)}
                                            </span>
                                            <span className="booking-passengers">
                                                <Users size={16} />
                                                {booking.numberOfPassengers} hành khách
                                            </span>
                                        </div>
                                    </div>
                                    <div className="booking-price">
                                        {booking.oldPrice !== booking.newPrice && (
                                            <span className="old-price">{formatPrice(booking.oldPrice)}</span>
                                        )}
                                        <span className="new-price">{formatPrice(booking.newPrice)}</span>
                                    </div>
                                </div>

                                <div className="booking-route">
                                    <div className="station-info">
                                        <MapPin size={20} className="station-icon departure" />
                                        <div className="station-details">
                                            <h4>{booking.departureStation.stationName}</h4>
                                            <p>{booking.departureStation.stationLocation}</p>
                                        </div>
                                    </div>

                                    <div className="route-line">
                                        <ArrowRight size={24} />
                                        <div className="route-details">
                                            <span className="route-name">
                                                <Train size={16} />
                                                {booking.route.routeName}
                                            </span>
                                            <span className="route-distance">
                                                {booking.route.distance} km
                                            </span>
                                        </div>
                                    </div>

                                    <div className="station-info">
                                        <MapPin size={20} className="station-icon arrival" />
                                        <div className="station-details">
                                            <h4>{booking.arrivalStation.stationName}</h4>
                                            <p>{booking.arrivalStation.stationLocation}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-details">
                                    <div className="detail-item">
                                        <User size={16} />
                                        <span>{booking.userName}</span>
                                    </div>

                                    <div className="detail-item">
                                        <Ticket size={16} />
                                        <span>{booking.ticketName}</span>
                                    </div>

                                    {booking.promotionCode && (
                                        <div className="detail-item">
                                            <Tag size={16} />
                                            <span>Mã giảm giá: {booking.promotionCode}</span>
                                        </div>
                                    )}

                                    {booking.payOrderCode && (
                                        <div className="detail-item">
                                            <CreditCard size={16} />
                                            <span>Mã thanh toán: {booking.payOrderCode}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="booking-tickets">
                                    <div className="tickets-header">
                                        <h4>Vé ({booking.tickets.length})</h4>
                                    </div>
                                    <div className="tickets-preview">
                                        {booking.tickets.slice(0, 3).map((ticket, index) => (
                                            <div key={ticket.ticketId} className="ticket-preview">
                                                <div className="ticket-code">
                                                    <QrCode size={16} />
                                                    {ticket.ticketCode}
                                                </div>
                                                <div className={`ticket-status ${getStatusColor(ticket.status)}`}>
                                                    {getStatusIcon(ticket.status)}
                                                    <span>{ticket.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {booking.tickets.length > 3 && (
                                            <div className="tickets-more">
                                                +{booking.tickets.length - 3} vé khác
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="booking-actions">
                                    <button
                                        className="btn-details"
                                        onClick={() => handleShowDetails(booking)}
                                    >
                                        <Eye size={16} />
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && selectedBooking && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Chi tiết Booking #{selectedBooking.bookingId}</h2>
                                <button className="modal-close" onClick={handleCloseModal}>
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="modal-body">
                                {/* Booking Info */}
                                <div className="modal-section">
                                    <h3>Thông tin booking</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Tên khách hàng:</label>
                                            <span>{selectedBooking.userName}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Thời gian đặt:</label>
                                            <span>{formatDateTime(selectedBooking.purchaseTime)}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Số hành khách:</label>
                                            <span>{selectedBooking.numberOfPassengers}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Loại vé:</label>
                                            <span>{selectedBooking.ticketName}</span>
                                        </div>
                                        {selectedBooking.promotionCode && (
                                            <div className="info-item">
                                                <label>Mã giảm giá:</label>
                                                <span>{selectedBooking.promotionCode}</span>
                                            </div>
                                        )}
                                        <div className="info-item">
                                            <label>Giá gốc:</label>
                                            <span>{formatPrice(selectedBooking.oldPrice)}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Giá thanh toán:</label>
                                            <span className="price-highlight">{formatPrice(selectedBooking.newPrice)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Route Info */}
                                <div className="modal-section">
                                    <h3>Thông tin tuyến đường</h3>
                                    <div className="route-info">
                                        <div className="route-stations">
                                            <div className="station">
                                                <MapPin className="station-pin departure" />
                                                <div>
                                                    <h4>{selectedBooking.departureStation.stationName}</h4>
                                                    <p>{selectedBooking.departureStation.stationLocation}</p>
                                                    {selectedBooking.departureStation.description && (
                                                        <small>{selectedBooking.departureStation.description}</small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="route-connector">
                                                <ArrowRight size={24} />
                                                <div className="route-meta">
                                                    <span>{selectedBooking.route.routeName}</span>
                                                    <span>{selectedBooking.route.distance} km</span>
                                                </div>
                                            </div>

                                            <div className="station">
                                                <MapPin className="station-pin arrival" />
                                                <div>
                                                    <h4>{selectedBooking.arrivalStation.stationName}</h4>
                                                    <p>{selectedBooking.arrivalStation.stationLocation}</p>
                                                    {selectedBooking.arrivalStation.description && (
                                                        <small>{selectedBooking.arrivalStation.description}</small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tickets */}
                                <div className="modal-section">
                                    <h3>Danh sách vé ({selectedBooking.tickets.length})</h3>
                                    <div className="tickets-list">
                                        {selectedBooking.tickets.map((ticket) => (
                                            <div key={ticket.ticketId} className="ticket-item">
                                                <div className="ticket-info">
                                                    <div className="ticket-header">
                                                        <span className="ticket-code">
                                                            <QrCode size={18} />
                                                            {ticket.ticketCode}
                                                        </span>
                                                        <div className={`ticket-status ${getStatusColor(ticket.status)}`}>
                                                            {getStatusIcon(ticket.status)}
                                                            <span>{ticket.status}</span>
                                                        </div>
                                                    </div>
                                                    <div className="ticket-validity">
                                                        <div className="validity-item">
                                                            <Clock size={14} />
                                                            <span>Có hiệu lực từ: {formatDateTime(ticket.validFrom)}</span>
                                                        </div>
                                                        <div className="validity-item">
                                                            <Clock size={14} />
                                                            <span>Có hiệu lực đến: {formatDateTime(ticket.validTo)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsPage;
