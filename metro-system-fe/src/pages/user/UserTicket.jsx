
import { useState, useEffect } from "react"
import { format } from "date-fns"
import axiosInstance from "../../config/axios"
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Form,
    InputGroup,
    Modal,
    Tab,
    Tabs,
    Spinner,
    Pagination,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap"
import {
    BsCalendar,
    BsClock,
    BsCreditCard,
    BsDownload,
    BsGeoAlt,
    BsShare,
    BsTag,
    BsTicket, BsX,
    BsSearch,
    BsArrowRight,
    BsCheck,
    BsExclamationCircle,
    BsFilter,
    BsSortDown,
    BsQrCode,
    BsInfoCircle,
    BsClockHistory,
} from "react-icons/bs"
import { FaTrain } from "react-icons/fa"

export default function UserTickets() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortBy, setSortBy] = useState("date-desc")
    const [currentPage, setCurrentPage] = useState(1)
    const [activeTab, setActiveTab] = useState("info")
    const ticketsPerPage = 5
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get('/account/ticket')
                if (response.data && response.data.status === 200) {
                    const ticketData = response.data.data || []
                    console.log('Fetched tickets:', ticketData)
                    setTickets(ticketData)
                } else {
                    console.error('Failed to fetch tickets:', response)
                    setError('Failed to fetch ticket data')
                }
            } catch (error) {
                console.error('Error fetching tickets:', error)
                setError('Error fetching ticket data: ' + (error.message || 'Unknown error'))
            } finally {
                setLoading(false)
            }
        }
        fetchTickets()
    }, [])

    const handleViewTicketDetails = (ticket) => {
        // setSelectedTicket(ticket)
        // setShowModal(true)
        // setActiveTab("info")
        navigator(`/checkin/${ticket.ticketId}`);
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedTicket(null)
    }

    const formatDate = (dateString) => {
        return format(new Date(dateString), "dd/MM/yyyy")
    }

    const formatDateTime = (dateString) => {
        return format(new Date(dateString), "dd/MM/yyyy HH:mm")
    }

    const formatPrice = (price) => {
        if (!price && price !== 0) return "N/A"
        return new Intl.NumberFormat("vi-VN").format(price) + " ₫"
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            ACTIVE: { variant: "danger", icon: BsCheck, text: "Còn hiệu lực" },
            USED: { variant: "dark", icon: BsCheck, text: "Đã sử dụng" },
            EXPIRED: { variant: "danger", icon: BsClock, text: "Hết hạn" },
            CANCELLED: { variant: "dark", icon: BsX, text: "Đã hủy" },
        }

        const config = statusConfig[status] || { variant: "dark", icon: BsExclamationCircle, text: "Không xác định" }
        const IconComponent = config.icon

        return (
            <Badge bg={config.variant} className="d-flex align-items-center gap-1 px-3 py-2 text-white border-0">
                <IconComponent size={14} />
                {config.text}
            </Badge>
        )
    }

    const getStatusCardBorder = (status) => {
        const borderConfig = {
            ACTIVE: "border-danger",
            USED: "border-dark",
            EXPIRED: "border-danger",
            CANCELLED: "border-dark",
        }
        return borderConfig[status] || "border-dark"
    }

    const filteredTickets = tickets
        .filter((ticket) => {
            const searchLower = searchQuery.toLowerCase()
            const matchesSearch =
                (ticket.departureStation?.stationName || '').toLowerCase().includes(searchLower) ||
                (ticket.arrivalStation?.stationName || '').toLowerCase().includes(searchLower) ||
                (ticket.routeName || '').toLowerCase().includes(searchLower)
            const matchesStatus = filterStatus === "all" || ticket.ticketStatus === filterStatus
            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "date-desc":
                    return new Date(b.purchaseTime) - new Date(a.purchaseTime)
                case "date-asc":
                    return new Date(a.purchaseTime) - new Date(b.purchaseTime)
                case "price-desc":
                    return b.newPrice - a.newPrice
                case "price-asc":
                    return a.newPrice - b.newPrice
                default:
                    return 0
            }
        })

    const indexOfLastTicket = currentPage * ticketsPerPage
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket)
    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage)

    if (error) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    padding: "2rem 0",
                }}
            >
                <Container>
                    <div className="text-center py-5">
                        <Card className="shadow-sm border" style={{ borderRadius: "10px", maxWidth: "600px", margin: "0 auto" }}>
                            <Card.Body className="p-5">
                                <div className="mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 bg-light" style={{
                                        width: "80px",
                                        height: "80px",
                                    }}
                                    >
                                        <BsExclamationCircle size={40} className="text-danger" />
                                    </div>
                                </div>
                                <h5 className="text-dark mb-3 fw-bold">Đã xảy ra lỗi</h5>
                                <p className="text-muted mb-4">{error}</p>
                                <Button
                                    variant="outline-danger"
                                    className="rounded-pill px-4 py-2"
                                    onClick={() => window.location.reload()}
                                >
                                    Thử lại
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
        )
    }

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    padding: "2rem 0",
                }}
            >
                <Container>
                    <div className="text-center py-5">
                        <Card className="shadow-sm border" style={{ borderRadius: "10px", maxWidth: "400px", margin: "0 auto" }}>
                            <Card.Body className="p-5">
                                <div className="mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 bg-light" style={{
                                        width: "80px",
                                        height: "80px",
                                    }}
                                    >
                                        <Spinner animation="border" variant="danger" style={{ width: "2.5rem", height: "2.5rem" }} />
                                    </div>
                                </div>
                                <h5 className="text-dark mb-3 fw-bold">Đang tải danh sách vé...</h5>
                                <p className="text-muted mb-0">Vui lòng chờ trong giây lát</p>
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
        )
    } return (
        <div
            style={{
                minHeight: "100vh",
                padding: "2rem 0",
                background: "#fafafa"
            }}
        >
            <Container>
                {/* Header */}
                <div className="text-center mb-5">
                    <Card className="shadow-sm border" style={{ borderRadius: "12px", maxWidth: "600px", margin: "0 auto" }}>
                        <Card.Body className="p-4">
                            <div className="mb-4">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 bg-light" style={{
                                        width: "70px",
                                        height: "70px",
                                    }}
                                >
                                    <BsTicket size={28} className="text-danger" />
                                </div>
                            </div>
                            <h1 className="fw-bold mb-3" style={{ color: "#dc3545" }}>Vé của tôi</h1>
                            <p className="text-muted mb-0">Quản lý và xem thông tin vé bạn đã mua</p>
                        </Card.Body>
                    </Card>
                </div>                {/* Search and Filter */}
                <Card className="shadow-sm border mb-4" style={{ borderRadius: "12px" }}>
                    <Card.Body className="p-3">
                        <Row className="g-3">
                            <Col lg={6}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border">
                                        <BsSearch size={16} className="text-danger" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm vé theo ga, tuyến..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="border"
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg={3}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border">
                                        <BsFilter size={16} className="text-danger" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="border"
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="VALID">Còn hiệu lực</option>
                                        <option value="USED">Đã sử dụng</option>
                                        <option value="EXPIRED">Hết hạn</option>
                                        <option value="CANCELLED">Đã hủy</option>
                                    </Form.Select>
                                </InputGroup>
                            </Col>
                            <Col lg={3}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border">
                                        <BsSortDown size={16} className="text-danger" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="border"
                                    >
                                        <option value="date-desc">Mới nhất</option>
                                        <option value="date-asc">Cũ nhất</option>
                                        <option value="price-desc">Giá cao nhất</option>
                                        <option value="price-asc">Giá thấp nhất</option>
                                    </Form.Select>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>                {/* Ticket List */}
                {currentTickets.length === 0 ? (
                    <Card className="shadow-sm border" style={{ borderRadius: "12px" }}>
                        <Card.Body className="text-center py-5">
                            <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 bg-light"
                                style={{
                                    width: "90px",
                                    height: "90px",
                                }}
                            >
                                <BsTicket size={40} className="text-danger" />
                            </div>
                            <h5 className="mb-3 fw-bold">Không tìm thấy vé nào</h5>
                            <p className="text-muted mb-4">
                                {searchQuery || filterStatus !== "all"
                                    ? "Không có vé nào phù hợp với bộ lọc của bạn"
                                    : "Bạn chưa mua vé nào"}
                            </p>
                            {(searchQuery || filterStatus !== "all") && (<Button
                                variant="outline-dark"
                                className="rounded-pill px-4 py-2"
                                onClick={() => {
                                    setSearchQuery("")
                                    setFilterStatus("all")
                                }}
                            >
                                Xóa bộ lọc
                            </Button>
                            )}
                        </Card.Body>
                    </Card>
                ) : (<div className="d-flex flex-column gap-4">
                    {currentTickets.map((ticket) => (
                        <Card
                            key={ticket.ticketId}
                            className="shadow-sm border"
                            style={{
                                borderRadius: "12px",
                                transition: "all 0.2s ease",
                                transform: "translateY(0)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-3px)"
                                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.08)"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)"
                                e.currentTarget.style.boxShadow = ""
                            }}
                        >
                            <Row className="g-0">
                                <Col lg={9}>
                                    <Card.Body className="p-4">
                                        {/* Header */}
                                        <div className="d-flex justify-content-between align-items-start mb-4">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="rounded-circle p-2 me-3 bg-light"
                                                >
                                                    <FaTrain size={16} className="text-danger" />
                                                </div>
                                                <div>
                                                    <small className="fw-bold text-dark">
                                                        {ticket.routeName}
                                                    </small>
                                                    <div className="text-muted small">#{ticket.ticketId.toString().padStart(6, "0")}</div>
                                                </div>
                                            </div>
                                            {getStatusBadge(ticket.ticketStatus)}
                                        </div>

                                        {/* Route */}
                                        <div className="mb-4">
                                            <h4 className="d-flex align-items-center gap-3 mb-2 fw-bold">
                                                <span>{ticket.departureStation?.stationName || 'N/A'}</span>
                                                <div
                                                    className="rounded-circle p-1 bg-light"
                                                >
                                                    <BsArrowRight size={16} className="text-danger" />
                                                </div>
                                                <span>{ticket.arrivalStation?.stationName || 'N/A'}</span>
                                            </h4>
                                            <div className="d-flex align-items-center text-muted">
                                                <BsCalendar size={20} className="me-2" />
                                                <small className="fw-medium">
                                                    {ticket.validFrom ? formatDate(ticket.validFrom) : 'N/A'} • <div style={{ fontSize: 20, color: 'red' }}>{ticket.ticketName}</div>
                                                </small>
                                            </div>
                                        </div>

                                        {/* Station Details */}
                                        <Row className="mb-4">
                                            <Col md={6}>
                                                <div
                                                    className="d-flex align-items-start p-3 rounded-3 bg-light"
                                                >                                                    <div className="rounded-circle p-2 me-3 bg-danger">
                                                        <BsGeoAlt size={16} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <small className="fw-bold text-dark">
                                                            Ga đi
                                                        </small>
                                                        <div className="fw-bold">{ticket.departureStation?.stationName || 'N/A'}</div>
                                                        <small className="text-muted">{ticket.departureStation?.address || 'Không có thông tin'}</small>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div
                                                    className="d-flex align-items-start p-3 rounded-3 bg-light"
                                                >                                                    <div className="rounded-circle p-2 me-3 bg-danger">
                                                        <BsGeoAlt size={16} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <small className="fw-bold text-dark">
                                                            Ga đến
                                                        </small>
                                                        <div className="fw-bold">{ticket.arrivalStation?.stationName || 'N/A'}</div>
                                                        <small className="text-muted">{ticket.arrivalStation?.address || 'Không có thông tin'}</small>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* Price and Action */}
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">                                                <div className="rounded-circle p-2 me-3 bg-danger">
                                                <BsTag size={16} className="text-white" />
                                            </div>
                                                <div>                                                    <div className="h4 fw-bold mb-0 text-danger">
                                                    {formatPrice(ticket.newPrice)}
                                                </div>
                                                    {ticket.oldPrice !== ticket.newPrice && (
                                                        <Badge bg="light" text="dark" className="rounded-pill border">
                                                            Giảm giá từ {formatPrice(ticket.oldPrice)}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Button variant="outline-dark"
                                                className="rounded-pill px-4 py-2 fw-bold"
                                                onClick={() => handleViewTicketDetails(ticket)}
                                            >
                                                Chi tiết vé
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Col>

                                {/* QR Code Section */}
                                <Col lg={3}>
                                    <div
                                        className="h-100 d-flex flex-column justify-content-center align-items-center bg-light p-4"
                                        style={{
                                            borderRadius: "0 12px 12px 0",
                                        }}
                                    >
                                        <div className="bg-white rounded-3 p-3 mb-3 border"

                                            onClick={() => navigate(`/checkin/${ticket.ticketId}`)}>
                                            <img
                                                src={ticket.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET-${ticket.ticketId}`}
                                                alt="QR Code"
                                                style={{ width: "80px", height: "80px", objectFit: "contain" }}

                                            />
                                        </div>
                                        <div className="text-center">
                                            <small className="text-danger fw-medium">Mã vé</small>
                                            <div className="fw-bold font-monospace text-dark">#{ticket.ticketId.toString().padStart(6, "0")}</div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
                )}                {/* Pagination */}
                {filteredTickets.length > 0 && totalPages > 1 && (
                    <Card className="shadow-sm border mt-4" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col>
                                    <small className="text-muted fw-medium">
                                        Hiển thị {indexOfFirstTicket + 1}-{Math.min(indexOfLastTicket, filteredTickets.length)} trong{" "}
                                        <span className="fw-bold text-dark">
                                            {filteredTickets.length}
                                        </span>{" "}
                                        vé
                                    </small>
                                </Col>
                                <Col xs="auto">
                                    <Pagination className="mb-0">
                                        <Pagination.Prev
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            className="rounded-pill me-2"
                                        />
                                        <Pagination.Item
                                            active
                                            className="rounded-pill mx-2"
                                        >
                                            {currentPage} / {totalPages}
                                        </Pagination.Item>
                                        <Pagination.Next
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            className="rounded-pill ms-2"
                                        />
                                    </Pagination>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>)}                {/* Modal */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    <div className="border" style={{ borderRadius: "8px" }}>
                        <Modal.Header className="border-bottom pb-3" style={{ borderRadius: "8px 8px 0 0" }}>
                            <Modal.Title className="d-flex align-items-center w-100">
                                <div className="rounded-circle p-2 me-3 bg-light">
                                    <BsTicket className="text-danger" size={20} />
                                </div>
                                <div>
                                    <h5 className="mb-0 text-dark">
                                        Chi tiết vé #{selectedTicket?.ticketId.toString().padStart(6, "0")}
                                    </h5>
                                    <small className="text-muted">{selectedTicket?.routeName}</small>
                                </div>
                            </Modal.Title>
                            <Button variant="outline-dark" className="border-0 rounded-circle p-2" onClick={handleCloseModal}>
                                <BsX size={20} />
                            </Button>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            {selectedTicket && (
                                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4" fill>                                    <Tab
                                    eventKey="info"
                                    title={
                                        <span className="d-flex align-items-center">
                                            <BsInfoCircle size={16} className="me-2" />
                                            Thông tin vé
                                        </span>
                                    }
                                >
                                    <div className="py-3">
                                        {/* Status */}
                                        <Card className="border mb-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                                            <Card.Body className="p-4">
                                                <Row className="align-items-center">
                                                    <Col>
                                                        <small className="text-muted fw-bold">Trạng thái vé</small>
                                                        <div className="mt-2">{getStatusBadge(selectedTicket.ticketStatus)}</div>
                                                    </Col>
                                                    <Col xs="auto" className="text-end">
                                                        <small className="text-muted fw-bold">Ngày mua</small>
                                                        <div className="fw-bold text-dark mt-1">
                                                            {formatDateTime(selectedTicket.purchaseTime)}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>

                                        {/* Route Information */}
                                        <div className="mb-4">
                                            <h6 className="d-flex align-items-center mb-3 text-dark">
                                                <div className="rounded-circle p-2 me-3 bg-light">
                                                    <FaTrain className="text-danger" size={20} />
                                                </div>
                                                Thông tin hành trình
                                            </h6>
                                            <Card className="border" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>                                                    <Card.Body className="p-4">
                                                <div className="text-center mb-4">                                                    <small className="fw-bold text-danger">
                                                    Tuyến
                                                </small>
                                                    <div className="h5 fw-bold text-dark mb-1">{selectedTicket.routeName}</div>
                                                    <small className="text-muted">{selectedTicket.ticketName}</small>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="text-center">
                                                        <div
                                                            className="rounded-circle p-3 mb-2 mx-auto d-inline-block bg-light"
                                                        >                                                            <BsGeoAlt className="text-danger" size={20} />
                                                        </div>
                                                        <small className="fw-bold text-dark">
                                                            Ga đi
                                                        </small>
                                                        <div className="fw-bold text-dark">{selectedTicket.departureStation?.stationName || 'N/A'}</div>
                                                        <small className="text-muted">{selectedTicket.departureStation?.address || 'Không có thông tin'}</small>
                                                    </div>
                                                    <div
                                                        className="rounded-circle p-2 bg-light"
                                                    >
                                                        <BsArrowRight className="text-danger" size={20} />
                                                    </div>
                                                    <div className="text-center">
                                                        <div
                                                            className="rounded-circle p-3 mb-2 mx-auto d-inline-block bg-light"
                                                        >                                                            <BsGeoAlt className="text-danger" size={20} />
                                                        </div>
                                                        <small className="fw-bold text-dark">
                                                            Ga đến
                                                        </small>
                                                        <div className="fw-bold text-dark">{selectedTicket.arrivalStation?.stationName || 'N/A'}</div>
                                                        <small className="text-muted">{selectedTicket.arrivalStation?.address || 'Không có thông tin'}</small>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                            </Card>
                                        </div>

                                        {/* Details */}                                            <Row>
                                            <Col md={6}>
                                                <Card
                                                    className="border h-100"
                                                    style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                                                >
                                                    <Card.Body className="p-4">
                                                        <h6 className="d-flex align-items-center mb-3 text-dark">
                                                            <div className="rounded-circle p-2 me-3 bg-light">
                                                                <BsCalendar className="text-danger" size={16} />
                                                            </div>
                                                            Thời gian hiệu lực
                                                        </h6>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <small className="text-muted fw-medium">Từ:</small>
                                                            <span className="fw-bold text-dark">{formatDateTime(selectedTicket.validFrom)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <small className="text-muted fw-medium">Đến:</small>
                                                            <span className="fw-bold text-dark">{formatDateTime(selectedTicket.validTo)}</span>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card
                                                    className="border h-100"
                                                    style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                                                >
                                                    <Card.Body className="p-4">
                                                        <h6 className="d-flex align-items-center mb-3 text-dark">
                                                            <div className="rounded-circle p-2 me-3 bg-light">
                                                                <BsCreditCard className="text-danger" size={16} />
                                                            </div>
                                                            Thông tin giá vé
                                                        </h6>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <small className="text-muted fw-medium">Loại vé:</small>
                                                            <span className="fw-bold text-dark">{selectedTicket.ticketName}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <small className="text-muted fw-medium">Giá vé:</small>
                                                            <span className="fw-bold text-dark">
                                                                {formatPrice(selectedTicket.newPrice)}
                                                            </span>
                                                        </div>
                                                        {selectedTicket.oldPrice !== selectedTicket.newPrice && (
                                                            <div className="d-flex justify-content-between">
                                                                <small className="text-muted fw-medium">Giá gốc:</small>
                                                                <Badge bg="light" text="dark" className="rounded-pill border">
                                                                    {formatPrice(selectedTicket.oldPrice)}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>
                                </Tab>                                    <Tab
                                    eventKey="qr"
                                    title={
                                        <span className="d-flex align-items-center">
                                            <BsQrCode size={16} className="me-2" />
                                            Mã QR
                                        </span>
                                    }
                                >
                                        <div className="text-center py-5">
                                            <div
                                                className="d-inline-block mb-4 p-3 rounded-3 border bg-white"
                                            >                                            <img
                                                    src={selectedTicket.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-${selectedTicket.ticketId}`}
                                                    alt="QR Code"
                                                    style={{ width: "200px", height: "200px", objectFit: "contain" }}
                                                />
                                            </div>
                                            <h6 className="text-dark mb-2">Mã QR vé tàu điện</h6>
                                            <p className="text-muted mb-4">Quét mã QR này tại cổng soát vé để vào ga tàu</p>
                                            <div className="d-flex justify-content-center gap-3">
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Tải xuống mã QR</Tooltip>}>                                                    <Button
                                                    variant="outline-dark"
                                                    className="rounded-pill px-4 py-2 fw-bold"
                                                >
                                                    <BsDownload size={16} className="me-2" />
                                                    Tải mã QR
                                                </Button>
                                                </OverlayTrigger>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Chia sẻ mã QR</Tooltip>}>                                                    <Button
                                                    variant="outline-dark"
                                                    className="rounded-pill px-4 py-2 fw-bold"
                                                >
                                                    <BsShare size={16} className="me-2" />
                                                    Chia sẻ
                                                </Button>
                                                </OverlayTrigger>
                                            </div>
                                        </div>
                                    </Tab>                                    <Tab
                                        eventKey="history"
                                        title={
                                            <span className="d-flex align-items-center">
                                                <BsClockHistory size={16} className="me-2" />
                                                Lịch sử
                                            </span>
                                        }
                                    >
                                        <div className="py-3">
                                            {selectedTicket.ticketDetails && selectedTicket.ticketDetails.length > 0 ? (
                                                <div>
                                                    <h6 className="d-flex align-items-center mb-4 text-dark">
                                                        <div
                                                            className="rounded-circle p-2 me-3 bg-light"
                                                        >
                                                            <BsClockHistory className="text-danger" size={20} />
                                                        </div>
                                                        Lịch sử sử dụng vé
                                                    </h6>
                                                    {selectedTicket.ticketDetails.map((detail, index) => (
                                                        <Card
                                                            key={detail.ticketDetailId}
                                                            className="border mb-3"
                                                            style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                                                        >
                                                            <Card.Body className="p-4">
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="rounded-circle p-3 me-3 bg-light">
                                                                            <BsCheck className="text-danger" size={20} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="fw-bold text-dark">Lượt đi #{detail.ticketDetailId}</div>
                                                                            <small className="text-muted">
                                                                                Vào: {formatDateTime(detail.checkIn)} • Ra: {formatDateTime(detail.checkOut)}
                                                                            </small>
                                                                        </div>
                                                                    </div>                                                                    <Badge bg="dark" text="white" className="rounded-pill px-3 py-2 border-0">
                                                                        Đã sử dụng
                                                                    </Badge>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-5">
                                                    <div
                                                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 bg-light"
                                                        style={{
                                                            width: "90px",
                                                            height: "90px",
                                                        }}
                                                    >
                                                        <BsClockHistory size={40} className="text-danger" />
                                                    </div>
                                                    <h6 className="text-dark mb-2">Chưa có lịch sử sử dụng</h6>
                                                    <p className="text-muted mb-0">Vé này chưa được sử dụng lần nào</p>
                                                </div>
                                            )}
                                        </div>
                                    </Tab>
                                </Tabs>
                            )}                        </Modal.Body>
                    </div>
                </Modal>
            </Container>
        </div>
    )
}
