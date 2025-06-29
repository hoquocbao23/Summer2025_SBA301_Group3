import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios";

const AdminStationManager = () => {
  const navigate = useNavigate();

  let isAdmin = false;
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    isAdmin = user && user.role === "admin";
  } catch (error) {
    console.error("Lỗi khi phân tích dữ liệu người dùng từ localStorage:", error);
  }


  // State to hold station list from API
  const [stations, setStations] = useState([]);
  // Function to fetch stations from backend
  const fetchStations = () => {
    axiosInstance
      .get("/stations")
      .then((res) => {
        if (res.data?.data) setStations(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch stations:", err));
  };

  // Fetch stations once on mount
  useEffect(() => {
    fetchStations();
  }, []);

  const [editStation, setEditStation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStations, setSelectedStations] = useState([]);

  const handleEditOrAdd = (station = null) => {
    setEditStation(
      station
        ? { ...station }
        : { stationName: "", stationLocation: "", url: "", status: "ACTIVE", description: "" },
    );
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        stationName: editStation.stationName,
        stationLocation: editStation.stationLocation,
        url: editStation.url,
        status: editStation.status,
        description: editStation.description,
      };
      if (editStation.stationId) {
        // API expects station ID in body as `station`
        payload.station = editStation.stationId;
        await axiosInstance.put(`/stations/${editStation.stationId}`, payload);
      } else {
        await axiosInstance.post("/stations", payload);
      }
      fetchStations();
      setShowModal(false);
      setEditStation(null);
    } catch (err) {
      console.error("Failed to save station:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ga này không?")) {
      try {
        await axiosInstance.delete(`/stations/${id}`);
        setStations((prev) => prev.filter((s) => s.stationId !== id));
      } catch (err) {
        console.error("Failed to delete station:", err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "long") {
      setEditStation({ ...editStation, location: { ...editStation.location, [name]: value } });
    } else {
      setEditStation({ ...editStation, [name]: value });
    }
  };

  const toggleStationSelection = (stationId) => {
    setSelectedStations((prev) =>
      prev.includes(stationId) ? prev.filter((id) => id !== stationId) : [...prev, stationId],
    );
  };

  const toggleAllStations = () => {
    setSelectedStations(selectedStations.length === stations.length ? [] : stations.map((station) => station.id));
  };

  const activeStations = stations.filter((s) => s.status === "Active").length;
  const inactiveStations = stations.filter((s) => s.status === "Inactive").length;

  return (
    <div className="station-manager">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1 text-dark fw-bold">Quản lý nhà ga</h2>
          <p className="text-muted mb-0">Quản lý các nhà ga và cấu hình của chúng</p>
        </div>
        <button
          onClick={() => handleEditOrAdd()}
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{ borderRadius: "8px" }}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          Thêm nhà ga
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Tổng số nhà ga</p>
                  <h3 className="mb-0 fw-bold text-dark">{stations.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                  <svg width="24" height="24" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Nhà ga hoạt động</p>
                  <h3 className="mb-0 fw-bold text-success">{activeStations}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-3">
                  <svg width="24" height="24" fill="currentColor" className="text-success" viewBox="0 0 16 16">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Nhà ga không hoạt động</p>
                  <h3 className="mb-0 fw-bold text-danger">{inactiveStations}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded-3">
                  <svg width="24" height="24" fill="currentColor" className="text-danger" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stations Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="card-header bg-white border-0 p-4" style={{ borderRadius: "12px 12px 0 0" }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">Danh sách nhà ga</h5>
            {selectedStations.length > 0 && (
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                {selectedStations.length} được chọn
              </span>
            )}
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedStations.length === stations.length && stations.length > 0}
                      onChange={toggleAllStations}
                      className="form-check-input"
                    />
                  </th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Nhà ga</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Vị trí</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Hình ảnh</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Trạng thái</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station) => (
                  <tr key={station.stationId}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStations.includes(station.stationId)}
                        onChange={() => toggleStationSelection(station.stationId)}
                        className="form-check-input"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="fw-semibold text-dark">{station.stationName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="fw-semibold text-dark">{station.stationLocation}</div>
<<<<<<< HEAD
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={station.url || "/placeholder.svg?height=40&width=60"}
                        alt={station.stationName}
                        className="rounded border"
                        style={{ width: "60px", height: "40px", objectFit: "cover" }}
                        onError={(e) => { e.target.src = "https://cdn.24h.com.vn/upload/3-2022/images/2022-09-29/Hinh-anh-moi-nhat-ve-ga-tren-cao-tuyen-metro-so-1-dat-99-tien-do-1-1664390321-916-width2000height1359.jpg?height=40&width=60"; }}
                      />
=======

                    </td>                    <td className="px-4 py-3">
                      {station.url && (
                        <img
                          src={station.url}
                          alt={station.stationName}
                          className="rounded border"
                          style={{ width: "60px", height: "40px", objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}

>>>>>>> 0b2e748d7935f96ff2c9c7bc7d94493a8f7d86ec
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge px-3 py-1 rounded-pill ${station.status === "ACTIVE"
                          ? "bg-success bg-opacity-10 text-success"
                          : "bg-danger bg-opacity-10 text-danger"
                          }`}
                      >
                        {station.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => handleEditOrAdd(station)}
                          className="btn btn-sm btn-outline-primary border-0"
                          title="Chỉnh sửa nhà ga"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V14.5a.5.5 0 0 0 .5.5h2.793L11.207 9z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(station.stationId)}
                          className="btn btn-sm btn-outline-danger border-0"
                          title="Xóa nhà ga"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path
                              fillRule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-top bg-light d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Hiển thị 1-{stations.length} trong số {stations.length} nhà ga
            </small>
            <small className="text-muted">Số hàng mỗi trang: 5</small>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{editStation?.stationId ? "Chỉnh sửa nhà ga" : "Thêm nhà ga mới"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tên nhà ga</label>
                    <input
                      type="text"
                      name="stationName"
                      value={editStation?.stationName || ""}
                      onChange={(e) => setEditStation({ ...editStation, stationName: e.target.value })}
                      placeholder="Nhập tên nhà ga"
                      className="form-control"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Vị trí</label>
                    <input
                      type="text"
                      name="stationLocation"
                      value={editStation?.stationLocation || ""}
                      onChange={(e) => setEditStation({ ...editStation, stationLocation: e.target.value })}
                      placeholder="Nhập vị trí nhà ga"
                      className="form-control"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">URL hình ảnh</label>
                    <input
                      type="text"
                      name="url"
                      value={editStation?.url || ""}
                      onChange={(e) => setEditStation({ ...editStation, url: e.target.value })}
                      placeholder="Nhập URL hình ảnh"
                      className="form-control"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Trạng thái</label>
                    <select
                      name="status"
                      value={editStation?.status || "ACTIVE"}
                      onChange={(e) => setEditStation({ ...editStation, status: e.target.value })}
                      className="form-select"
                      style={{ borderRadius: "8px" }}
                    >
                      <option value="ACTIVE">Hoạt động</option>
                      <option value="INACTIVE">Không hoạt động</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Mô tả</label>
                    <textarea
                      name="description"
                      value={editStation?.description || ""}
                      onChange={(e) => setEditStation({ ...editStation, description: e.target.value })}
                      placeholder="Nhập mô tả"
                      className="form-control"
                      style={{ borderRadius: "8px", minHeight: "100px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  style={{ borderRadius: "8px" }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  style={{ borderRadius: "8px" }}
                >
                  {editStation?.stationId ? "Cập nhật nhà ga" : "Thêm nhà ga"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStationManager;