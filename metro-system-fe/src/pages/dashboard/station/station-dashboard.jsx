"use client"

import { useState } from "react"

const initialStations = [
  {
    id: 1,
    name: "Ben Thanh",
    location: { lat: 10.7718, long: 106.6983 },
    gates: 4,
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    status: "Active",
  },
  {
    id: 2,
    name: "Ba Son",
    location: { lat: 10.7805, long: 106.7081 },
    gates: 3,
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Hiep Thanh",
    location: { lat: 10.7902, long: 106.7155 },
    gates: 2,
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    status: "Active",
  },
  {
    id: 4,
    name: "Thao Dien",
    location: { lat: 10.7991, long: 106.7223 },
    gates: 3,
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    status: "Active",
  },
  {
    id: 5,
    name: "An Phu",
    location: { lat: 10.8055, long: 106.7301 },
    gates: 2,
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    status: "Inactive",
  },
]

const AdminStationManager = () => {
  const [stations, setStations] = useState(initialStations)
  const [editStation, setEditStation] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedStations, setSelectedStations] = useState([])

  const handleEditOrAdd = (station = null) => {
    setEditStation(
      station
        ? { ...station, location: { ...station.location } }
        : { name: "", location: { lat: "", long: "" }, gates: "", image: "", status: "Active" },
    )
    setShowModal(true)
  }

  const handleSave = () => {
    if (editStation.id) {
      setStations(
        stations.map((s) =>
          s.id === editStation.id
            ? {
                ...editStation,
                location: {
                  lat: Number.parseFloat(editStation.location.lat),
                  long: Number.parseFloat(editStation.location.long),
                },
                gates: Number.parseInt(editStation.gates),
              }
            : s,
        ),
      )
    } else {
      const newId = stations.length ? stations[stations.length - 1].id + 1 : 1
      setStations([
        ...stations,
        {
          ...editStation,
          id: newId,
          location: {
            lat: Number.parseFloat(editStation.location.lat),
            long: Number.parseFloat(editStation.location.long),
          },
          gates: Number.parseInt(editStation.gates),
        },
      ])
    }
    setShowModal(false)
    setEditStation(null)
  }

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ga này không?")) {
      setStations(stations.filter((s) => s.id !== id))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "lat" || name === "long") {
      setEditStation({ ...editStation, location: { ...editStation.location, [name]: value } })
    } else {
      setEditStation({ ...editStation, [name]: value })
    }
  }

  const toggleStationSelection = (stationId) => {
    setSelectedStations((prev) =>
      prev.includes(stationId) ? prev.filter((id) => id !== stationId) : [...prev, stationId],
    )
  }

  const toggleAllStations = () => {
    setSelectedStations(selectedStations.length === stations.length ? [] : stations.map((station) => station.id))
  }

  const activeStations = stations.filter((s) => s.status === "Active").length
  const inactiveStations = stations.filter((s) => s.status === "Inactive").length

  return (
    <div className="station-manager">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1 text-dark fw-bold">Station Management</h2>
          <p className="text-muted mb-0">Manage your transit stations and their configurations</p>
        </div>
        <button
          onClick={() => handleEditOrAdd()}
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{ borderRadius: "8px" }}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          Add Station
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Total Stations</p>
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
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Active Stations</p>
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
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Inactive Stations</p>
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
            <h5 className="mb-0 fw-semibold">Stations List</h5>
            {selectedStations.length > 0 && (
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                {selectedStations.length} selected
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
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Station</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Location</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Gates</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Image</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Status</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station) => (
                  <tr key={station.id}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStations.includes(station.id)}
                        onChange={() => toggleStationSelection(station.id)}
                        className="form-check-input"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="fw-semibold text-dark">{station.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center text-muted small">
                        <svg width="14" height="14" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                        </svg>
                        {station.location.lat.toFixed(4)}, {station.location.long.toFixed(4)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-1 rounded-pill">
                        {station.gates} gates
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={station.image || "/placeholder.svg?height=40&width=60"}
                        alt={station.name}
                        className="rounded border"
                        style={{ width: "60px", height: "40px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=40&width=60"
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge px-3 py-1 rounded-pill ${
                          station.status === "Active"
                            ? "bg-success bg-opacity-10 text-success"
                            : "bg-danger bg-opacity-10 text-danger"
                        }`}
                      >
                        {station.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => handleEditOrAdd(station)}
                          className="btn btn-sm btn-outline-primary border-0"
                          title="Edit station"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V14.5a.5.5 0 0 0 .5.5h2.793L11.207 9z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(station.id)}
                          className="btn btn-sm btn-outline-danger border-0"
                          title="Delete station"
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
              Showing 1-{stations.length} of {stations.length} stations
            </small>
            <small className="text-muted">Rows per page: 5</small>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{editStation?.id ? "Edit Station" : "Add New Station"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Station Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editStation?.name || ""}
                      onChange={handleInputChange}
                      placeholder="Enter station name"
                      className="form-control"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Number of Gates</label>
                    <input
                      type="number"
                      name="gates"
                      value={editStation?.gates || ""}
                      onChange={handleInputChange}
                      placeholder="Number of gates"
                      min="1"
                      className="form-control"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Latitude</label>
                    <input
                      type="number"
                      name="lat"
                      value={editStation?.location?.lat || ""}
                      onChange={handleInputChange}
                      placeholder="Latitude"
                      step="any"
                      className="form-control"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Longitude</label>
                    <input
                      type="number"
                      name="long"
                      value={editStation?.location?.long || ""}
                      onChange={handleInputChange}
                      placeholder="Longitude"
                      step="any"
                      className="form-control"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={editStation?.image || ""}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                      className="form-control"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      name="status"
                      value={editStation?.status || "Active"}
                      onChange={handleInputChange}
                      className="form-select"
                      style={{ borderRadius: "8px" }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
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
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave} style={{ borderRadius: "8px" }}>
                  {editStation?.id ? "Update Station" : "Add Station"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminStationManager
