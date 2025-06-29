"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../../config/axios"
import { Users, CheckCircle, X, Edit3, Trash2 } from "lucide-react"

const CustomerManagement = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [editUser, setEditUser] = useState({ email: "", fullname: "", role: "", status: "" })
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get("/user")
      setUsers(res.data?.data || [])
    } catch (err) {
      console.error("Error fetching users:", err)
    }
    setLoading(false)
  }

  const handleEdit = async (id) => {
    try {
      const res = await axiosInstance.get(`/user/${id}`)
      setSelectedUser(res.data.data)
      setEditUser(res.data.data)
      setShowModal(true)
    } catch (err) {
      console.error("Error fetching user:", err)
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.put(`/user/${selectedUser.id}`, editUser)
      setUsers(users.map((user) => (user.id === selectedUser.id ? res.data.data : user)))
      setShowModal(false)
    } catch (err) {
      console.error("Error updating user:", err)
    }
    setLoading(false)
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    inactive: users.filter((u) => u.status !== "ACTIVE").length,
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "600", color: "#333", marginBottom: "8px", margin: 0 }}>
            Quản lý người dùng
          </h2>
          <p style={{ color: "#6c757d", fontSize: "14px", margin: 0 }}>Quản lý các người dùng và cấu hình của chúng</p>
        </div>
        <button
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          + Thêm người dùng
        </button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div style={{ backgroundColor: "white", border: "1px solid #e9ecef", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p
                style={{ color: "#6c757d", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", margin: 0 }}
              >
                TỔNG SỐ NGƯỜI DÙNG
              </p>
              <h3 style={{ fontSize: "32px", fontWeight: "700", color: "#333", margin: "8px 0 0 0" }}>{stats.total}</h3>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#dbeafe",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={24} style={{ color: "#3b82f6" }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "white", border: "1px solid #e9ecef", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p
                style={{ color: "#6c757d", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", margin: 0 }}
              >
                NGƯỜI DÙNG HOẠT ĐỘNG
              </p>
              <h3 style={{ fontSize: "32px", fontWeight: "700", color: "#333", margin: "8px 0 0 0" }}>
                {stats.active}
              </h3>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#dcfce7",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle size={24} style={{ color: "#16a34a" }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "white", border: "1px solid #e9ecef", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p
                style={{ color: "#6c757d", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", margin: 0 }}
              >
                NGƯỜI DÙNG KHÔNG HOẠT ĐỘNG
              </p>
              <h3 style={{ fontSize: "32px", fontWeight: "700", color: "#333", margin: "8px 0 0 0" }}>
                {stats.inactive}
              </h3>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#fee2e2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={24} style={{ color: "#dc2626" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#333", marginBottom: "20px" }}>
          Danh sách người dùng
        </h4>

        <div
          style={{ backgroundColor: "white", border: "1px solid #e9ecef", borderRadius: "12px", overflow: "hidden" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th
                  style={{
                    border: "none",
                    padding: "16px 20px",
                    fontWeight: "600",
                    color: "#374151",
                    textAlign: "left",
                  }}
                >
                  Người dùng
                </th>
                <th
                  style={{
                    border: "none",
                    padding: "16px 20px",
                    fontWeight: "600",
                    color: "#374151",
                    textAlign: "left",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    border: "none",
                    padding: "16px 20px",
                    fontWeight: "600",
                    color: "#374151",
                    textAlign: "left",
                  }}
                >
                  Vai trò
                </th>
                <th
                  style={{
                    border: "none",
                    padding: "16px 20px",
                    fontWeight: "600",
                    color: "#374151",
                    textAlign: "left",
                  }}
                >
                  Trạng thái
                </th>
                <th
                  style={{
                    border: "none",
                    padding: "16px 20px",
                    fontWeight: "600",
                    color: "#374151",
                    textAlign: "left",
                  }}
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} style={{ borderTop: index === 0 ? "none" : "1px solid #f3f4f6" }}>
                  <td style={{ border: "none", padding: "16px 20px", color: "#374151" }}>
                    {user.fullname || "Không có tên"}
                  </td>
                  <td style={{ border: "none", padding: "16px 20px", color: "#6b7280" }}>{user.email}</td>
                  <td style={{ border: "none", padding: "16px 20px" }}>
                    <span
                      style={{
                        backgroundColor: user.role === "ADMIN" ? "#3b82f6" : "#6b7280",
                        color: "white",
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontWeight: "500",
                      }}
                    >
                      {user.role === "ADMIN" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td style={{ border: "none", padding: "16px 20px" }}>
                    <span
                      style={{
                        backgroundColor: user.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                        color: user.status === "ACTIVE" ? "#166534" : "#991b1b",
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontWeight: "500",
                      }}
                    >
                      {user.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td style={{ border: "none", padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleEdit(user.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3b82f6",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc2626",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "#f8f9fa",
              borderTop: "1px solid #e9ecef",
              fontSize: "14px",
              color: "#6b7280",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              Hiển thị 1-{users.length} trong số {users.length} người dùng
            </span>
            <span>Số hàng mỗi trang: {users.length}</span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "500px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #e9ecef",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>Chỉnh sửa người dùng</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={editUser.email || ""}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Tên đầy đủ
                </label>
                <input
                  type="text"
                  value={editUser.fullname || ""}
                  onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Vai trò
                  </label>
                  <select
                    value={editUser.role || ""}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="CUSTOMER">User</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Trạng thái
                  </label>
                  <select
                    value={editUser.status || ""}
                    onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "20px",
                borderTop: "1px solid #e9ecef",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: "#374151",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerManagement
