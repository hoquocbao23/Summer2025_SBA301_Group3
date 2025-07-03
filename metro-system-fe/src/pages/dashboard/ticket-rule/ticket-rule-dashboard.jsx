import { useState, useEffect } from "react"
import TicketRuleService from "../../../services/ticketRuleService"

const AdminTicketRuleManager = () => {
  const [ticketRules, setTicketRules] = useState([])
  const [editTicketRule, setEditTicketRule] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedTicketRules, setSelectedTicketRules] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  // Load initial data
  useEffect(() => {
    loadTicketRules()
  }, [])

  const loadTicketRules = async () => {
    try {
      setLoading(true)
      setApiError(null)
      const response = await TicketRuleService.getAllTicketRules()

      if (response.data.ticketRules) {
        console.log('Ticket rules loaded:', response.data)
        setTicketRules(response.data.ticketRules)
      } else {
        setTicketRules([])
      }
    } catch (error) {
      console.error('Error loading ticket rules:', error)
      setApiError(`API Error: ${error.message}. Using fallback data.`)
      // Fallback data for development
      setTicketRules([
        {
          ruleId: 1,
          ruleName: "Standard Rate",
          description: "Standard pricing for regular passengers",
          basePrice: 8000,
          pricePerKm: 2000,
          status: "ACTIVE"
        },
        {
          ruleId: 2,
          ruleName: "Student Discount",
          description: "Discounted pricing for students",
          basePrice: 6000,
          pricePerKm: 1500,
          maxPrice: 12000,
          discountPercentage: 25,
          status: "ACTIVE"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const validateForm = async () => {
    const newErrors = {}

    // Validate rule name
    if (!editTicketRule.ruleName?.trim()) {
      newErrors.ruleName = "Rule name is required"
    } else if (editTicketRule.ruleName.trim().length < 3) {
      newErrors.ruleName = "Rule name must be at least 3 characters"
    } else if (editTicketRule.ruleName.trim().length > 100) {
      newErrors.ruleName = "Rule name must not exceed 100 characters"
    }

    // Validate description
    if (!editTicketRule.description?.trim()) {
      newErrors.description = "Description is required"
    } else if (editTicketRule.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    } else if (editTicketRule.description.trim().length > 500) {
      newErrors.description = "Description must not exceed 500 characters"
    }

    // Validate base price
    const basePrice = parseFloat(editTicketRule.basePrice)
    if (!basePrice || basePrice <= 0) {
      newErrors.basePrice = "Base price must be greater than 0"
    } else if (basePrice > 50000) {
      newErrors.basePrice = "Base price must not exceed 50,000 VND"
    }

    // Validate price per km
    const pricePerKm = parseFloat(editTicketRule.pricePerKm)
    if (pricePerKm < 0) {
      newErrors.pricePerKm = "Price per km cannot be negative"
    } else if (pricePerKm > 10000) {
      newErrors.pricePerKm = "Price per km must not exceed 10,000 VND"
    }

    // Check for duplicate rule name
    if (!newErrors.ruleName) {
      const isDuplicateName = ticketRules.some(rule =>
        rule.ruleId !== editTicketRule.ruleId &&
        rule.ruleName.toLowerCase().trim() === editTicketRule.ruleName?.toLowerCase().trim()
      )
      if (isDuplicateName) {
        newErrors.ruleName = "Rule name already exists"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEditOrAdd = (ticketRule = null) => {
    const newTicketRule = ticketRule
      ? { ...ticketRule }
      : {
        ruleName: "",
        description: "",
        basePrice: 6000,
        pricePerKm: 2000,
        status: "ACTIVE"
      }

    setEditTicketRule(newTicketRule)
    setErrors({})
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setApiError(null)

      const isValid = await validateForm()
      if (!isValid) {
        setLoading(false)
        return
      }

      const ticketRuleData = {
        ruleName: editTicketRule.ruleName?.trim(),
        description: editTicketRule.description?.trim(),
        basePrice: parseFloat(editTicketRule.basePrice),
        pricePerKm: parseFloat(editTicketRule.pricePerKm),
        status: editTicketRule.status || "ACTIVE"
      }

      if (editTicketRule.ruleId) {
        // Update existing ticket rule
        await TicketRuleService.updateTicketRule(editTicketRule.ruleId, ticketRuleData)
      } else {
        // Create new ticket rule
        await TicketRuleService.createTicketRule(ticketRuleData)
      }

      await loadTicketRules()
      setShowModal(false)
      setEditTicketRule(null)
      setErrors({})
    } catch (error) {
      console.error('Error saving ticket rule:', error)
      setApiError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (ruleId, currentStatus) => {
    try {
      setLoading(true)
      setApiError(null)
      if (currentStatus === "ACTIVE") {
        await TicketRuleService.deactivateTicketRule(ruleId)
      } else if (currentStatus === "INACTIVE") {
        await TicketRuleService.activateTicketRule(ruleId)
      }
      await loadTicketRules()
    } catch (error) {
      console.error('Error toggling ticket rule status:', error)
      setApiError(`Failed to ${currentStatus === "ACTIVE" ? "deactivate" : "activate"} ticket rule: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditTicketRule({ ...editTicketRule, [name]: value })
    setErrors({})
  }

  const toggleTicketRuleSelection = (ruleId) => {
    setSelectedTicketRules((prev) =>
      prev.includes(ruleId) ? prev.filter((id) => id !== ruleId) : [...prev, ruleId],
    )
  }

  const toggleAllTicketRules = () => {
    setSelectedTicketRules(selectedTicketRules.length === ticketRules.length ? [] : ticketRules.map((rule) => rule.ruleId))
  }

  const activeRules = ticketRules.filter((r) => r.status === "ACTIVE").length
  const inactiveRules = ticketRules.filter((r) => r.status === "INACTIVE").length

  return (
    <div className="ticket-rule-manager">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1 text-dark fw-bold">Ticket Rule Management</h2>
          <p className="text-muted mb-0">Manage pricing rules and policies for metro tickets</p>
        </div>
        <button
          onClick={() => handleEditOrAdd()}
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{ borderRadius: "8px" }}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          Add Ticket Rule
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading ticket rules...</p>
        </div>
      )}

      {/* Error Alert */}
      {apiError && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <div className="d-flex align-items-center">
            <svg width="16" height="16" fill="currentColor" className="text-danger me-2" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <span><strong>Error:</strong> {apiError}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setApiError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Total Rules</p>
                  <h3 className="mb-0 fw-bold text-dark">{ticketRules.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                  <svg width="24" height="24" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                    <path d="M4 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z" />
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
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Active Rules</p>
                  <h3 className="mb-0 fw-bold text-success">{activeRules}</h3>
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
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Inactive Rules</p>
                  <h3 className="mb-0 fw-bold text-danger">{inactiveRules}</h3>
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

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase fw-medium">Avg Base Price</p>
                  <h3 className="mb-0 fw-bold text-info">
                    {ticketRules.length > 0
                      ? Math.round(ticketRules.reduce((sum, rule) => sum + rule.basePrice, 0) / ticketRules.length).toLocaleString()
                      : 0
                    } VND
                  </h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-3">
                  <svg width="24" height="24" fill="currentColor" className="text-info" viewBox="0 0 16 16">
                    <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5 5 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                    <path d="M14 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5 5 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Rules Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="card-header bg-white border-0 p-4" style={{ borderRadius: "12px 12px 0 0" }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">Ticket Rules List</h5>
            {selectedTicketRules.length > 0 && (
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                {selectedTicketRules.length} selected
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
                      checked={selectedTicketRules.length === ticketRules.length && ticketRules.length > 0}
                      onChange={toggleAllTicketRules}
                      className="form-check-input"
                    />
                  </th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Rule Name</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Base Price</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Price/Km</th>
                  {/* <th className="border-0 px-4 py-3 fw-semibold text-dark">Max Price</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Discount</th> */}
                  <th className="border-0 px-4 py-3 fw-semibold text-dark">Status</th>
                  <th className="border-0 px-4 py-3 fw-semibold text-dark text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ticketRules.map((rule) => (
                  <tr key={rule.ruleId}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTicketRules.includes(rule.ruleId)}
                        onChange={() => toggleTicketRuleSelection(rule.ruleId)}
                        className="form-check-input"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="fw-semibold text-dark">{rule.ruleName}</div>
                        <div className="text-muted small">{rule.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="fw-semibold text-primary">{rule.basePrice?.toLocaleString()} VND</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted">{rule.pricePerKm?.toLocaleString()} VND</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge px-3 py-1 rounded-pill ${rule.status === "ACTIVE"
                          ? "bg-success bg-opacity-10 text-success"
                          : "bg-danger bg-opacity-10 text-danger"
                          }`}
                      >
                        {rule.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => handleEditOrAdd(rule)}
                          className="btn btn-sm btn-outline-primary border-0"
                          title="Edit ticket rule"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V14.5a.5.5 0 0 0 .5.5h2.793L11.207 9z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(rule.ruleId, rule.status)}
                          className={`btn btn-sm border-0 ${rule.status === "ACTIVE"
                            ? "btn-outline-warning"
                            : "btn-outline-success"
                            }`}
                          title={rule.status === "ACTIVE" ? "Deactivate ticket rule" : "Activate ticket rule"}
                        >
                          {rule.status === "ACTIVE" ? (
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                            </svg>
                          )}
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
              Showing 1-{ticketRules.length} of {ticketRules.length} ticket rules
            </small>
            <small className="text-muted">Rows per page: 10</small>
          </div>
        </div>
      </div>

      {/* Edit/Add Ticket Rule Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editTicketRule?.ruleId ? "Edit Ticket Rule" : "Add New Ticket Rule"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="alert alert-danger mx-4 mb-0" role="alert">
                  <div className="d-flex align-items-center">
                    <svg width="16" height="16" fill="currentColor" className="text-danger me-2" viewBox="0 0 16 16">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                    <span className="fw-semibold">Please fix these {Object.keys(errors).length} errors:</span>
                  </div>
                </div>
              )}

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Rule Name</label>
                    <input
                      type="text"
                      name="ruleName"
                      value={editTicketRule?.ruleName || ""}
                      onChange={handleInputChange}
                      placeholder="Enter rule name"
                      className={`form-control ${errors.ruleName ? 'is-invalid' : ''}`}
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                    {errors.ruleName && <div className="invalid-feedback d-block">{errors.ruleName}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Status</label>
                    <select
                      name="status"
                      value={editTicketRule?.status || "ACTIVE"}
                      onChange={handleInputChange}
                      className="form-select"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark">Description</label>
                    <textarea
                      name="description"
                      value={editTicketRule?.description || ""}
                      onChange={handleInputChange}
                      placeholder="Enter rule description"
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      rows="3"
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                    {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Base Price (VND)</label>
                    <input
                      type="number"
                      name="basePrice"
                      value={editTicketRule?.basePrice || ""}
                      onChange={handleInputChange}
                      placeholder="8000"
                      min="0"
                      step="1000"
                      className={`form-control ${errors.basePrice ? 'is-invalid' : ''}`}
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                    {errors.basePrice && <div className="invalid-feedback d-block">{errors.basePrice}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Price per Km (VND)</label>
                    <input
                      type="number"
                      name="pricePerKm"
                      value={editTicketRule?.pricePerKm || ""}
                      onChange={handleInputChange}
                      placeholder="2000"
                      min="0"
                      step="500"
                      className={`form-control ${errors.pricePerKm ? 'is-invalid' : ''}`}
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                    {errors.pricePerKm && <div className="invalid-feedback d-block">{errors.pricePerKm}</div>}
                  </div>

                  {/* <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Max Price (VND)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={editTicketRule?.maxPrice || ""}
                      onChange={handleInputChange}
                      placeholder="15000"
                      min="0"
                      step="1000"
                      className={`form-control ${errors.maxPrice ? 'is-invalid' : ''}`}
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                    {errors.maxPrice && <div className="invalid-feedback d-block">{errors.maxPrice}</div>}
                  </div> */}

                  {/* <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Discount Percentage (%)</label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={editTicketRule?.discountPercentage || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      step="5"
                      className={`form-control ${errors.discountPercentage ? 'is-invalid' : ''}`}
                      style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                    {errors.discountPercentage && <div className="invalid-feedback d-block">{errors.discountPercentage}</div>}
                  </div> */}
                </div>

                {/* Price Preview */}
                {editTicketRule?.basePrice && editTicketRule?.pricePerKm && (
                  <div className="mt-4 p-3 bg-light rounded">
                    <h6 className="mb-2">Price Preview</h6>
                    <div className="row">
                      <div className="col-md-4">
                        <small className="text-muted">5km trip:</small>
                        <div className="fw-semibold">
                          {parseFloat(editTicketRule.basePrice).toLocaleString()} VND
                        </div>
                      </div>
                      <div className="col-md-4">
                        <small className="text-muted">10km trip:</small>
                        <div className="fw-semibold">
                          {(parseFloat(editTicketRule.basePrice) + 
                          (10 - 6) * parseFloat(editTicketRule.pricePerKm))
                          .toLocaleString()} VND
                        </div>
                      </div>
                      <div className="col-md-4">
                        <small className="text-muted">20km trip:</small>
                        <div className="fw-semibold">
                          {(parseFloat(editTicketRule.basePrice) + 
                          (20 - 6) * parseFloat(editTicketRule.pricePerKm))
                          .toLocaleString()} VND
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                <button
                  type="button"
                  className={`btn btn-primary ${Object.keys(errors).length > 0 ? 'disabled' : ''}`}
                  onClick={handleSave}
                  disabled={Object.keys(errors).length > 0}
                  style={{ borderRadius: "8px" }}
                >
                  {editTicketRule?.ruleId ? "Update Rule" : "Add Rule"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTicketRuleManager
