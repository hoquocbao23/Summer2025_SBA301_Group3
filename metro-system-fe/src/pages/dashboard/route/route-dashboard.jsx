import { useState } from "react"
import { availableStations, initialRoutes, getStationName } from "../../../data"

const AdminRouteManager = () => {
  const [routes, setRoutes] = useState(initialRoutes)
  const [editRoute, setEditRoute] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedRoutes, setSelectedRoutes] = useState([])
  const [showStationModal, setShowStationModal] = useState(false)
  const [currentRouteStations, setCurrentRouteStations] = useState([])
  const [currentRouteId, setCurrentRouteId] = useState(null)

  const handleEditOrAdd = (route = null) => {
    setEditRoute(
      route
        ? { ...route, stations: [...route.stations] }
        : { 
            name: "", 
            description: "", 
            status: "Active", 
            color: "#007bff",
            totalDistance: 0,
            estimatedTime: 0,
            operatingHours: "05:00 - 23:00",
            frequency: "5 minutes",
            ticketPrice: 15000,
            stations: [] 
          },
    )
    setShowModal(true)
  }

  const handleSave = () => {
    if (editRoute.id) {
      setRoutes(
        routes.map((r) =>
          r.id === editRoute.id
            ? {
                ...editRoute,
                totalDistance: Number.parseFloat(editRoute.totalDistance),
                estimatedTime: Number.parseInt(editRoute.estimatedTime),
                ticketPrice: Number.parseInt(editRoute.ticketPrice),
              }
            : r,
        ),
      )
    } else {
      const newId = routes.length ? Math.max(...routes.map(r => r.id)) + 1 : 1
      setRoutes([
        ...routes,
        {
          ...editRoute,
          id: newId,
          totalDistance: Number.parseFloat(editRoute.totalDistance),
          estimatedTime: Number.parseInt(editRoute.estimatedTime),
          ticketPrice: Number.parseInt(editRoute.ticketPrice),
        },
      ])
    }
    setShowModal(false)
    setEditRoute(null)
  }

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tuyến này không?")) {
      setRoutes(routes.filter((r) => r.id !== id))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditRoute({ ...editRoute, [name]: value })
  }

  const toggleRouteSelection = (routeId) => {
    setSelectedRoutes((prev) =>
      prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId],
    )
  }

  const toggleAllRoutes = () => {
    setSelectedRoutes(selectedRoutes.length === routes.length ? [] : routes.map((route) => route.id))
  }

  const handleManageStations = (route) => {
    setCurrentRouteId(route.id)
    setCurrentRouteStations([...route.stations])
    setShowStationModal(true)
  }

  const addStationToRoute = () => {
    const newOrder = currentRouteStations.length + 1
    setCurrentRouteStations([
      ...currentRouteStations,
      { stationId: availableStations[0].id, order: newOrder, distanceFromPrevious: 0 }
    ])
  }

  const removeStationFromRoute = (index) => {
    const newStations = currentRouteStations.filter((_, i) => i !== index)
    // Update orders
    const updatedStations = newStations.map((station, i) => ({
      ...station,
      order: i + 1
    }))
    setCurrentRouteStations(updatedStations)
  }

  const updateStationInRoute = (index, field, value) => {
    const updated = [...currentRouteStations]
    if (field === 'stationId') {
      updated[index] = { ...updated[index], stationId: parseInt(value) }
    } else if (field === 'distanceFromPrevious') {
      updated[index] = { ...updated[index], distanceFromPrevious: parseFloat(value) || 0 }
    }
    setCurrentRouteStations(updated)
  }

  const moveStation = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === currentRouteStations.length - 1)) {
      return
    }
    
    const newStations = [...currentRouteStations];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap stations
    [newStations[index], newStations[targetIndex]] = [newStations[targetIndex], newStations[index]];
    
    // Update orders
    newStations.forEach((station, i) => {
      station.order = i + 1
    })
    
    setCurrentRouteStations(newStations)
  }
  const saveStations = () => {
    setRoutes(routes.map(route => 
      route.id === currentRouteId 
        ? { ...route, stations: [...currentRouteStations] }
        : route
    ))
    setShowStationModal(false)
    setCurrentRouteStations([])
    setCurrentRouteId(null)
  }

  const activeRoutes = routes.filter((r) => r.status === "Active").length
  const planningRoutes = routes.filter((r) => r.status === "Planning").length
  const inactiveRoutes = routes.filter((r) => r.status === "Inactive").length
  return (
    <div className="route-manager">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1 text-dark fw-bold">Route Management</h2>
          <p className="text-muted mb-0">Manage your metro routes and their station configurations</p>
        </div>
        <button
          onClick={() => handleEditOrAdd()}
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{ borderRadius: "8px" }}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          Add Route
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Total Routes</p>
                  <h3 className="mb-0 fw-bold text-dark">{routes.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                  <svg width="24" height="24" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Active Routes</p>
                  <h3 className="mb-0 fw-bold text-success">{activeRoutes}</h3>
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

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Planning Routes</p>
                  <h3 className="mb-0 fw-bold text-warning">{planningRoutes}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-3">
                  <svg width="24" height="24" fill="currentColor" className="text-warning" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Inactive Routes</p>
                  <h3 className="mb-0 fw-bold text-danger">{inactiveRoutes}</h3>
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

      {/* Routes Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="card-header bg-white border-0 p-4" style={{ borderRadius: "12px 12px 0 0" }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">Routes List</h5>
            {selectedRoutes.length > 0 && (
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                {selectedRoutes.length} selected
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
                      checked={selectedRoutes.length === routes.length && routes.length > 0}
                      onChange={toggleAllRoutes}
                      className="form-check-input"
                    />
                  </th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Route</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Stations</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Distance</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Time</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Price</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Status</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRoutes.includes(route.id)}
                        onChange={() => toggleRouteSelection(route.id)}
                        className="form-check-input"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle me-3"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: route.color,
                          }}
                        ></div>
                        <div style={{ flex: 1 }}>
                          <div className="fw-semibold text-dark">{route.name}</div>
                          <div className="text-muted small">{route.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-1 rounded-pill">
                        {route.stations.length} stations
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted">{route.totalDistance} km</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted">{route.estimatedTime} min</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="fw-semibold">{route.ticketPrice.toLocaleString()} VND</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge px-3 py-1 rounded-pill ${
                          route.status === "Active"
                            ? "bg-success bg-opacity-10 text-success"
                            : route.status === "Planning"
                            ? "bg-warning bg-opacity-10 text-warning"
                            : "bg-danger bg-opacity-10 text-danger"
                        }`}
                      >
                        {route.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => handleManageStations(route)}
                          className="btn btn-sm btn-outline-info border-0"
                          title="Manage stations"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditOrAdd(route)}
                          className="btn btn-sm btn-outline-primary border-0"
                          title="Edit route"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V14.5a.5.5 0 0 0 .5.5h2.793L11.207 9z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="btn btn-sm btn-outline-danger border-0"
                          title="Delete route"
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
              Showing 1-{routes.length} of {routes.length} routes
            </small>
            <small className="text-muted">Rows per page: 5</small>
          </div>
        </div>
      </div>      {/* Edit/Add Route Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{editRoute?.id ? "Edit Route" : "Add New Route"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label className="form-label fw-semibold text-dark">Route Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editRoute?.name || ""}
                      onChange={handleInputChange}
                      placeholder="Enter route name"
                      className="form-control"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                  </div>
                  <div className="col-md-6" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label style={{alignSelf: "start"}} className="form-label fw-semibold text-dark">Color</label>
                    <input
                      type="color"
                      name="color"
                      value={editRoute?.color || "#007bff"}
                      onChange={handleInputChange}
                      className="form-control form-control-color"
                      style={{ borderRadius: "8px", display: "inline-block", width: "100%" }}
                    />
                  </div>
                  <div className="col-12" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label className="form-label fw-semibold text-dark">Description</label>
                    <textarea
                      name="description"
                      value={editRoute?.description || ""}
                      onChange={handleInputChange}
                      placeholder="Enter route description"
                      className="form-control"
                      rows="3"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                  </div>
                  <div className="col-md-6" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label className="form-label fw-semibold text-dark">Total Distance (km)</label>
                    <input
                      type="number"
                      name="totalDistance"
                      value={editRoute?.totalDistance || ""}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      step="0.1"
                      className="form-control"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                  </div>
                  <div className="col-md-6" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label className="form-label fw-semibold text-dark">Estimated Time (minutes)</label>
                    <input
                      type="number"
                      name="estimatedTime"
                      value={editRoute?.estimatedTime || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="1"
                      className="form-control"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                  </div>
                  <div className="col-md-6" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label className="form-label fw-semibold text-dark">Operating Hours</label>
                    <input
                      type="text"
                      name="operatingHours"
                      value={editRoute?.operatingHours || ""}
                      onChange={handleInputChange}
                      placeholder="05:00 - 23:00"
                      className="form-control"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                  </div>
                  <div className="col-md-6" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label className="form-label fw-semibold text-dark">Frequency</label>
                    <input
                      type="text"
                      name="frequency"
                      value={editRoute?.frequency || ""}
                      onChange={handleInputChange}
                      placeholder="3-5 minutes"
                      className="form-control"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                  </div>
                  <div className="col-md-6" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label className="form-label fw-semibold text-dark">Ticket Price (VND)</label>
                    <input
                      type="number"
                      name="ticketPrice"
                      value={editRoute?.ticketPrice || ""}
                      onChange={handleInputChange}
                      placeholder="15000"
                      min="1"
                      className="form-control"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                  </div>
                  <div className="col-md-6" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <label className="form-label fw-semibold text-dark">Status</label>
                    <select
                      name="status"
                      value={editRoute?.status || "Active"}
                      onChange={handleInputChange}
                      className="form-select"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    >
                      <option value="Active">Active</option>
                      <option value="Planning">Planning</option>
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
                  {editRoute?.id ? "Update Route" : "Add Route"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Station Management Modal */}
      {showStationModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Manage Route Stations</h5>
                <button type="button" className="btn-close" onClick={() => setShowStationModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Route Stations</h6>
                  <button
                    onClick={addStationToRoute}
                    className="btn btn-sm btn-primary"
                    style={{ borderRadius: "6px" }}
                  >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    Add Station
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Order</th>
                        <th>Station</th>
                        <th>Distance from Previous (km)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRouteStations.map((routeStation, index) => (
                        <tr key={index}>
                          <td className="text-center fw-bold">{routeStation.order}</td>
                          <td>
                            <select
                              value={routeStation.stationId}
                              onChange={(e) => updateStationInRoute(index, 'stationId', e.target.value)}
                              className="form-select form-select-sm"
                            >
                              {availableStations.map(station => (
                                <option key={station.id} value={station.id}>
                                  {station.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              value={routeStation.distanceFromPrevious}
                              onChange={(e) => updateStationInRoute(index, 'distanceFromPrevious', e.target.value)}
                              className="form-control form-control-sm"
                              step="0.1"
                              min="0"
                              disabled={index === 0}
                              placeholder={index === 0 ? "Starting point" : "0.0"}
                            />
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                onClick={() => moveStation(index, 'up')}
                                disabled={index === 0}
                                className="btn btn-sm btn-outline-secondary"
                                title="Move up"
                              >
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => moveStation(index, 'down')}
                                disabled={index === currentRouteStations.length - 1}
                                className="btn btn-sm btn-outline-secondary"
                                title="Move down"
                              >
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8 4a.5.5 0 0 0-.5.5v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5A.5.5 0 0 0 8 4z"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => removeStationFromRoute(index)}
                                className="btn btn-sm btn-outline-danger"
                                title="Remove station"
                              >
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {currentRouteStations.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-4">
                            No stations added yet. Click "Add Station" to start building your route.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {currentRouteStations.length > 0 && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <h6 className="mb-2">Route Summary</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <small className="text-muted">Total Stations:</small>
                        <div className="fw-semibold">{currentRouteStations.length}</div>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted">Total Distance:</small>
                        <div className="fw-semibold">
                          {currentRouteStations.reduce((sum, station) => sum + station.distanceFromPrevious, 0).toFixed(1)} km
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <small className="text-muted">Route Path:</small>
                      <div className="small">
                        {currentRouteStations.map((routeStation, index) => (
                          <span key={index}>
                            {getStationName(routeStation.stationId)}
                            {index < currentRouteStations.length - 1 && ' → '}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowStationModal(false)}
                  style={{ borderRadius: "8px" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveStations}
                  style={{ borderRadius: "8px" }}
                >
                  Save Stations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminRouteManager
