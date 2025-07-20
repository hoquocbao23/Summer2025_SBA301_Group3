import { useState, useEffect } from "react"
import {
    User,
    Mail,
    Edit3,
    Save,
    X,
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
        setTimeout(() => {
            setMessage({ text: "", type: "" })
        }, 5000)
    }

    const fetchUserProfile = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get('/account')
            if (res.data?.status === 200) {
                setUserData(res.data?.data || null)
                setEditedFullname(res.data?.data?.fullname || "")
            } else {
                showMessage("Không thể tải thông tin tài khoản", "error")
            }
        } catch (err) {
            showMessage("Không thể tải thông tin tài khoản", "error")
            console.error("Error fetching profile:", err)
        }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!editedFullname.trim()) {
            showMessage("Họ tên không được để trống", "error")
            return
        }

        setSaving(true)
        try {
            const res = await axiosInstance.put('/account/update', {
                fullname: editedFullname,
                email: userData.email // Include email as it's required in UpdateAccountRequestDTO
            })

            if (res.data?.status === 200) {
                setUserData({ ...userData, fullname: editedFullname })
                setIsEditing(false)
                showMessage("Cập nhật thành công!", "success")
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
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            showMessage("Vui lòng điền đầy đủ thông tin", "error")
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage("Mật khẩu xác nhận không khớp", "error")
            return
        }

        if (passwordData.newPassword.length < 6) {
            showMessage("Mật khẩu mới phải có ít nhất 6 ký tự", "error")
            return
        }

        setChangingPassword(true)
        try {
            const res = await axiosInstance.put('/account/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            })

            if (res.data?.status === 200) {
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

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
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

    useEffect(() => {
        fetchUserProfile()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-light p-4 d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status"></div>
                    <p>Đang tải thông tin...</p>
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
                            <X size={48} />
                        </div>
                        <h3 className="fs-4 fw-semibold text-dark mb-2">Không thể tải dữ liệu</h3>
                        <p className="text-muted mb-4">Có lỗi xảy ra khi tải thông tin tài khoản</p>
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
            <div className="container" style={{ maxWidth: "800px" }}>
                {/* Message display */}
                {message.text && (
                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}>
                        {message.text}
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="h2 fw-bold text-dark mb-2">Thông tin tài khoản</h1>
                    <p className="text-muted">Quản lý và cập nhật thông tin cá nhân</p>
                </div>

                {/* Profile Card */}
                <div className="card shadow border-0 rounded-3 mb-4">
                    {/* Profile Header */}
                    <div className="bg-primary text-white p-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center"
                                style={{ width: "60px", height: "60px" }}>
                                <span className="fs-4 fw-bold">{getInitials(userData.fullname)}</span>
                            </div>
                            <div>
                                <h2 className="h4 fw-bold mb-1">{userData.fullname}</h2>
                                <p className="d-flex align-items-center gap-2 mb-1">
                                    <Mail size={16} />
                                    {userData.email}
                                </p>
                                <div className="d-flex gap-2">
                                    <span className="badge bg-info">{userData.role}</span>
                                    <span className={`badge ${getStatusColor(userData.status)}`}>
                                        {userData.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-body p-4">
                        {/* Basic Information */}
                        <div className="mb-4">
                            <h3 className="h5 fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                                <User className="text-primary" size={20} />
                                Thông tin cơ bản
                            </h3>

                            <div className="row g-3">
                                {/* Email */}
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Email</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        value={userData.email}
                                        readOnly
                                    />
                                </div>

                                {/* Role */}
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Vai trò</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        value={userData.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                                        readOnly
                                    />
                                </div>

                                {/* Full Name */}
                                <div className="col-12">
                                    <label className="form-label fw-medium">Họ và tên</label>
                                    {isEditing ? (
                                        <div className="d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control"
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
                                                    <div className="spinner-border spinner-border-sm"></div>
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
                                                Sửa
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <hr />

                        {/* Password Change Section */}
                        <div>
                            <h3 className="h5 fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                                <Lock className="text-primary" size={20} />
                                Đổi mật khẩu
                            </h3>

                            {!isChangingPassword ? (
                                <div className="p-3 bg-warning bg-opacity-10 rounded border border-warning">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="mb-1 fw-medium">Mật khẩu</p>
                                            <small className="text-muted">Thay đổi mật khẩu để bảo vệ tài khoản</small>
                                        </div>
                                        <button
                                            onClick={() => setIsChangingPassword(true)}
                                            className="btn btn-warning"
                                        >
                                            <Lock size={16} className="me-2" />
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 border rounded">
                                    {/* Current Password */}
                                    <div className="mb-3">
                                        <label className="form-label">Mật khẩu hiện tại</label>
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
                                                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                            >
                                                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="mb-3">
                                        <label className="form-label">Mật khẩu mới</label>
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
                                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                            >
                                                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="mb-3">
                                        <label className="form-label">Xác nhận mật khẩu mới</label>
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
                                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            >
                                                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={changingPassword}
                                            className="btn btn-success"
                                        >
                                            {changingPassword ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={16} className="me-2" />
                                                    Cập nhật
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleCancelPasswordChange}
                                            className="btn btn-outline-secondary"
                                            disabled={changingPassword}
                                        >
                                            <X size={16} className="me-2" />
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
