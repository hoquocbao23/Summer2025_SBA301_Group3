import { useState, useEffect } from "react"
import {
    User,
    Mail,
    Shield,
    CheckCircle,
    Edit3,
    Save,
    X,
    Settings,
    Crown,
    UserCheck,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react"
import axiosInstance from "../../config/axios"

export default function UserProfile() {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editedFullname, setEditedFullname] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)

    // Password change states
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const [changingPassword, setChangingPassword] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })

    const showMessage = (text, type) => {
        setMessage({ text, type })
        // Clear message after 5 seconds
        setTimeout(() => {
            setMessage({ text: "", type: "" })
        }, 5000)
    }

    const fetchUserProfile = async () => {
        setLoading(true)
        try {
            // Get userId from localStorage
            const userId = localStorage.getItem("id")
            if (!userId) {
                showMessage("Không tìm thấy thông tin đăng nhập", "error")
                setLoading(false)
                return
            }

            const res = await axiosInstance.get(`/account?id=${userId}`)
            if (res.data?.status === 200) {
                setUserData(res.data?.data || null)
                setEditedFullname(res.data?.data?.fullname || "")
            } else {
                showMessage("Không thể tải dữ liệu profile", "error")
            }
        } catch (err) {
            showMessage("Không thể tải dữ liệu profile", "error")
            console.error("Error fetching profile:", err)
        }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!editedFullname.trim()) {
            showMessage("Họ và tên không được để trống", "error")
            return
        }

        setSaving(true)
        try {
            const userId = localStorage.getItem("id")
            if (!userId) {
                showMessage("Không tìm thấy thông tin đăng nhập", "error")
                setSaving(false)
                return
            }

            // Call API to update profile
            const res = await axiosInstance.put(`/account/${userId}`, {
                fullname: editedFullname
            })

            if (res.data?.status === 200) {
                setUserData({ ...userData, fullname: editedFullname })
                setIsEditing(false)
                showMessage("Cập nhật thông tin thành công!", "success")
            } else {
                showMessage("Không thể cập nhật thông tin", "error")
            }
        } catch (err) {
            showMessage("Không thể cập nhật thông tin", "error")
            console.error("Error updating profile:", err)
        }
        setSaving(false)
    }

    const handleCancel = () => {
        setEditedFullname(userData?.fullname || "")
        setIsEditing(false)
    }

    const handlePasswordChange = async () => {
        // Validate passwords
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            showMessage("Vui lòng điền đầy đủ thông tin", "error")
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage("Mật khẩu mới không khớp", "error")
            return
        }

        if (passwordData.newPassword.length < 6) {
            showMessage("Mật khẩu mới phải có ít nhất 6 ký tự", "error")
            return
        }

        setChangingPassword(true)
        try {
            const userId = localStorage.getItem("id")
            if (!userId) {
                showMessage("Không tìm thấy thông tin đăng nhập", "error")
                setChangingPassword(false)
                return
            }

            // Call API to change password
            const res = await axiosInstance.put(`/account/${userId}/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })

            if (res.data?.status === 200) {
                // Reset form
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
                setIsChangingPassword(false)
                showMessage("Đổi mật khẩu thành công!", "success")
            } else {
                showMessage(res.data?.message || "Không thể đổi mật khẩu", "error")
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Không thể đổi mật khẩu"
            showMessage(errorMessage, "error")
            console.error("Error changing password:", err)
        }
        setChangingPassword(false)
    }

    const handleCancelPasswordChange = () => {
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
        setIsChangingPassword(false)
    }

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case "ADMIN":
                return <Crown className="h-4 w-4" />
            case "CUSTOMER":
                return <User className="h-4 w-4" />
            default:
                return <UserCheck className="h-4 w-4" />
        }
    }

    const getRoleColor = (role) => {
        switch (role) {
            case "ADMIN":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "CUSTOMER":
                return "bg-blue-100 text-blue-800 border-blue-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "ACTIVE":
                return "bg-success text-white"
            case "INACTIVE":
                return "bg-danger text-white"
            default:
                return "bg-secondary text-white"
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-light p-4">
                <div className="container mx-auto pt-8">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-light d-flex align-items-center justify-content-center p-4">
                <div className="card w-100" style={{ maxWidth: "400px" }}>
                    <div className="card-body text-center p-4">
                        <div className="text-danger mb-4">
                            <X className="h-12 w-12 mx-auto" size={48} />
                        </div>
                        <h3 className="fs-4 fw-semibold text-dark mb-2">Không thể tải dữ liệu</h3>
                        <p className="text-muted mb-4">Đã xảy ra lỗi khi tải thông tin profile</p>
                        <button className="btn btn-primary w-100" onClick={fetchUserProfile}>
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-light p-4">
            <div className="container mx-auto pt-8">
                {/* Message display */}
                {message.text && (
                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`} role="alert">
                        {message.text}
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="display-5 fw-bold text-dark mb-2">Thông tin cá nhân</h1>
                    <p className="text-muted">Quản lý và cập nhật thông tin tài khoản của bạn</p>
                </div>

                {/* Main Profile Card */}
                <div className="card shadow border-0 rounded-3 overflow-hidden mb-4">
                    {/* Profile Header */}
                    <div className="bg-primary text-white p-4">
                        <div className="d-flex flex-wrap justify-content-between">
                            <div className="d-flex gap-3 mb-3 mb-md-0">
                                <div className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                                    <span className="fs-3 fw-bold">{getInitials(userData.fullname)}</span>
                                </div>
                                <div>
                                    <h2 className="fs-3 fw-bold mb-1">{userData.fullname}</h2>
                                    <p className="d-flex align-items-center gap-2 mb-1">
                                        <Mail size={16} />
                                        {userData.email}
                                    </p>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        <span className="badge bg-info">
                                            <div className="d-flex align-items-center gap-1">
                                                {getRoleIcon(userData.role)}
                                                {userData.role}
                                            </div>
                                        </span>
                                        <span className={`badge ${getStatusColor(userData.status)}`}>
                                            <div className="d-flex align-items-center gap-1">
                                                <CheckCircle size={12} />
                                                {userData.status}
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-outline-light d-flex align-items-center gap-1">
                                <Settings size={16} />
                                Cài đặt
                            </button>
                        </div>
                    </div>

                    <div className="card-body p-4">
                        {/* Profile Information */}
                        <div className="mb-4">
                            <h3 className="fs-4 fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                                <User className="text-primary" size={20} />
                                Thông tin cơ bản
                            </h3>

                            <div className="row g-3">
                                {/* Email */}
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <Mail size={16} />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={userData.email}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Vai trò</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            {getRoleIcon(userData.role)}
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={userData.role}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div className="col-md-12">
                                    <label className="form-label fw-medium">Họ và tên</label>
                                    {isEditing ? (
                                        <div className="d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control flex-grow-1"
                                                value={editedFullname}
                                                onChange={(e) => setEditedFullname(e.target.value)}
                                                placeholder="Nhập họ và tên"
                                            />
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="btn btn-success"
                                            >
                                                {saving ? (
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                ) : (
                                                    <Save size={16} />
                                                )}
                                            </button>
                                            <button onClick={handleCancel} className="btn btn-outline-secondary">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-between align-items-center p-2 border rounded bg-light">
                                            <span>{userData.fullname}</span>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <Edit3 size={16} className="me-1" />
                                                Chỉnh sửa
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="col-md-12">
                                    <label className="form-label fw-medium">Trạng thái</label>
                                    <div className="p-2 border rounded bg-light">
                                        <span className={`badge ${getStatusColor(userData.status)}`}>
                                            <div className="d-flex align-items-center gap-1">
                                                <CheckCircle size={12} />
                                                {userData.status}
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr />

                        {/* Password Change Section */}
                        <div className="mb-4">
                            <h3 className="fs-4 fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                                <Lock className="text-primary" size={20} />
                                Bảo mật
                            </h3>

                            {!isChangingPassword ? (
                                <div className="p-4 bg-warning bg-opacity-10 rounded border border-warning">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                        <div>
                                            <h4 className="fs-5 fw-semibold mb-2">Mật khẩu</h4>
                                            <p className="text-muted mb-md-0">Thay đổi mật khẩu để bảo vệ tài khoản của bạn</p>
                                        </div>
                                        <button onClick={() => setIsChangingPassword(true)} className="btn btn-warning">
                                            <Lock size={16} className="me-2" />
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 border rounded shadow-sm">
                                    <h4 className="fs-5 fw-semibold mb-3">Thay đổi mật khẩu</h4>

                                    {/* Current Password */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Mật khẩu hiện tại</label>
                                        <div className="input-group">
                                            <input
                                                type={showPasswords.current ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) =>
                                                    setPasswordData((prev) => ({
                                                        ...prev,
                                                        currentPassword: e.target.value,
                                                    }))
                                                }
                                                className="form-control"
                                                placeholder="Nhập mật khẩu hiện tại"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => togglePasswordVisibility("current")}
                                            >
                                                {showPasswords.current ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Mật khẩu mới</label>
                                        <div className="input-group">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={(e) =>
                                                    setPasswordData((prev) => ({
                                                        ...prev,
                                                        newPassword: e.target.value,
                                                    }))
                                                }
                                                className="form-control"
                                                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => togglePasswordVisibility("new")}
                                            >
                                                {showPasswords.new ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Xác nhận mật khẩu mới</label>
                                        <div className="input-group">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) =>
                                                    setPasswordData((prev) => ({
                                                        ...prev,
                                                        confirmPassword: e.target.value,
                                                    }))
                                                }
                                                className="form-control"
                                                placeholder="Nhập lại mật khẩu mới"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => togglePasswordVisibility("confirm")}
                                            >
                                                {showPasswords.confirm ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-2 mt-4">
                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={changingPassword}
                                            className="btn btn-success"
                                        >
                                            {changingPassword ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={16} className="me-2" />
                                                    Cập nhật mật khẩu
                                                </>
                                            )}
                                        </button>
                                        <button onClick={handleCancelPasswordChange} className="btn btn-outline-secondary" disabled={changingPassword}>
                                            <X size={16} className="me-2" />
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <hr />

                        {/* Account Statistics */}
                        <div>
                            <h3 className="fs-4 fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                                <Shield className="text-primary" size={20} />
                                Thống kê tài khoản
                            </h3>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="card bg-primary bg-opacity-10 border-primary border-opacity-25">
                                        <div className="card-body text-center p-3">
                                            <div className="fs-4 fw-bold text-primary mb-1">
                                                {userData.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                                            </div>
                                            <div className="small text-primary">Trạng thái tài khoản</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card bg-info bg-opacity-10 border-info border-opacity-25">
                                        <div className="card-body text-center p-3">
                                            <div className="fs-4 fw-bold text-info mb-1">
                                                {userData.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
                                            </div>
                                            <div className="small text-info">Loại tài khoản</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4 text-muted small">
                    <p>Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</p>
                </div>
            </div>
        </div>
    )
}
