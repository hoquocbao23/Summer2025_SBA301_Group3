import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios";

const AdminTrainManager = () => {
    const navigate = useNavigate();

    let isAdmin = false;
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        isAdmin = user && user.role === "admin";
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
    }

    // State management
    const [trains, setTrains] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [editTrain, setEditTrain] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrains, setSelectedTrains] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch trains from backend
    const fetchTrains = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/trains");
            if (response.data?.data) {
                setTrains(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch trains:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch routes for dropdown - use routes summary endpoint
    const fetchRoutes = async () => {
        try {
            const response = await axiosInstance.get("/routes/summary");
            if (response.data?.data) {
                // Use routes summary data (id, routeName)
                setRoutes(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch routes:", error);
            // Fallback to empty array on error to prevent crashes
            setRoutes([]);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchTrains();
        fetchRoutes();
    }, []);

    // Handle add/edit modal
    const handleEditOrAdd = (train = null) => {
        setEditTrain(
            train
                ? { ...train }
                : { trainName: "", trainModel: "", trainManufacturer: "", route: null }
        );
        setShowModal(true);
    };

    // Handle save (create or update) - updated for new backend API
    const handleSave = async () => {
        try {
            // Validate required fields with backend constraints
            if (!editTrain.trainName?.trim()) {
                alert("Train name is required");
                return;
            }

            if (editTrain.trainName.trim().length < 2) {
                alert("Train name must be at least 2 characters long");
                return;
            }

            if (editTrain.trainName.trim().length > 50) {
                alert("Train name cannot exceed 50 characters");
                return;
            }

            if (!editTrain.trainModel?.trim()) {
                alert("Train model is required");
                return;
            }

            if (editTrain.trainModel.trim().length < 2) {
                alert("Train model must be at least 2 characters long");
                return;
            }

            if (editTrain.trainModel.trim().length > 50) {
                alert("Train model cannot exceed 50 characters");
                return;
            }

            if (editTrain.trainManufacturer && editTrain.trainManufacturer.trim().length > 100) {
                alert("Train manufacturer cannot exceed 100 characters");
                return;
            }

            // Prepare TrainRequestDTO payload
            const payload = {
                trainName: editTrain.trainName.trim(),
                trainModel: editTrain.trainModel.trim(),
                trainManufacturer: editTrain.trainManufacturer?.trim() || ""
            };

            if (editTrain.trainId) {
                // Update existing train - can add/change route assignment
                if (editTrain.route?.id) {
                    // If route is selected, send idRoute as query parameter
                    await axiosInstance.put(`/trains/${editTrain.trainId}?idRoute=${editTrain.route.id}`, payload);
                } else {
                    // Update train without route assignment (idRoute not provided)
                    await axiosInstance.put(`/trains/${editTrain.trainId}`, payload);
                }
            } else {
                // Create new train
                const response = await axiosInstance.post("/trains", payload);

                // If route is selected and train created successfully, assign route via update
                if (editTrain.route && response.data?.data?.trainId) {
                    try {
                        const routeParam = `?idRoute=${editTrain.route.id}`;
                        await axiosInstance.put(`/trains/${response.data.data.trainId}${routeParam}`, payload);
                    } catch (routeError) {
                        console.warn("Train created but route assignment failed:", routeError);
                        alert("Train created successfully, but route assignment failed. You can edit the train to assign a route.");
                    }
                }
            }

            fetchTrains();
            setShowModal(false);
            setEditTrain(null);
        } catch (error) {
            console.error("Failed to save train:", error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Failed to save train: ${errorMessage}`);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this train?")) {
            try {
                await axiosInstance.delete(`/trains/${id}`);
                setTrains((prev) => prev.filter((t) => t.trainId !== id));
            } catch (error) {
                console.error("Failed to delete train:", error);
                alert(`Failed to delete train: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    // Handle checkbox selection
    const toggleTrainSelection = (trainId) => {
        setSelectedTrains((prev) =>
            prev.includes(trainId)
                ? prev.filter((id) => id !== trainId)
                : [...prev, trainId]
        );
    };

    const toggleAllTrains = () => {
        setSelectedTrains(
            selectedTrains.length === trains.length
                ? []
                : trains.map((train) => train.trainId)
        );
    };

    // Statistics
    const totalTrains = trains.length;
    const activeTrains = trains.filter(t => t.route).length;
    const unassignedTrains = trains.filter(t => !t.route).length;

    return (
        <div className="train-manager">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h3 mb-1 text-dark fw-bold">Train Management</h2>
                    <p className="text-muted mb-0">Manage trains and their route assignments</p>
                </div>
                <button
                    onClick={() => handleEditOrAdd()}
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
                    style={{ borderRadius: "8px" }}
                >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    Add Train
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1 small text-uppercase fw-medium">Total Trains</p>
                                    <h3 className="mb-0 fw-bold text-dark">{totalTrains}</h3>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                                    <svg width="24" height="24" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                                        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2zm0 1h12a1 1 0 0 1 1 1v1H1V6a1 1 0 0 1 1-1zM1 8h14v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8z" />
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
                                    <p className="text-muted mb-1 small text-uppercase fw-medium">Active Trains</p>
                                    <h3 className="mb-0 fw-bold text-success">{activeTrains}</h3>
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
                                    <p className="text-muted mb-1 small text-uppercase fw-medium">Unassigned</p>
                                    <h3 className="mb-0 fw-bold text-warning">{unassignedTrains}</h3>
                                </div>
                                <div className="bg-warning bg-opacity-10 p-3 rounded-3">
                                    <svg width="24" height="24" fill="currentColor" className="text-warning" viewBox="0 0 16 16">
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trains Table */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
                <div className="card-header bg-white border-0 p-4" style={{ borderRadius: "12px 12px 0 0" }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-semibold">Train List</h5>
                        {selectedTrains.length > 0 && (
                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                                {selectedTrains.length} selected
                            </span>
                        )}
                    </div>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedTrains.length === trains.length && trains.length > 0}
                                                onChange={toggleAllTrains}
                                                className="form-check-input"
                                            />
                                        </th>
                                        <th className="border-0 px-4 py-3 fw-semibold text-dark">Train Name</th>
                                        <th className="border-0 px-4 py-3 fw-semibold text-dark">Model</th>
                                        <th className="border-0 px-4 py-3 fw-semibold text-dark">Route</th>
                                        <th className="border-0 px-4 py-3 fw-semibold text-dark">Status</th>
                                        <th className="border-0 px-4 py-3 fw-semibold text-dark text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trains.map((train) => (
                                        <tr key={train.trainId}>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTrains.includes(train.trainId)}
                                                    onChange={() => toggleTrainSelection(train.trainId)}
                                                    className="form-check-input"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                                                        <svg width="20" height="20" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                                                            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2zm0 1h12a1 1 0 0 1 1 1v1H1V6a1 1 0 0 1 1-1zM1 8h14v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold text-dark">{train.trainName}</div>
                                                        <small className="text-muted">ID: {train.trainId}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="fw-medium text-dark">{train.trainModel}</div>
                                                {train.trainManufacturer && (
                                                    <small className="text-muted">{train.trainManufacturer}</small>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {train.route ? (
                                                    <div>
                                                        <div className="fw-medium text-dark">{train.route.routeName}</div>
                                                        <small className="text-muted">
                                                            Route ID: {train.route.id || train.route.routeId}
                                                        </small>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted fst-italic">Not assigned</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`badge px-3 py-1 rounded-pill ${train.route
                                                        ? "bg-success bg-opacity-10 text-success"
                                                        : "bg-warning bg-opacity-10 text-warning"
                                                        }`}
                                                >
                                                    {train.route ? "Active" : "Unassigned"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        onClick={() => handleEditOrAdd(train)}
                                                        className="btn btn-sm btn-outline-primary border-0"
                                                        title="Edit train"
                                                    >
                                                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V14.5a.5.5 0 0 0 .5.5h2.793L11.207 9z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(train.trainId)}
                                                        className="btn btn-sm btn-outline-danger border-0"
                                                        title="Delete train"
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
                    )}

                    {/* Pagination */}
                    <div className="px-4 py-3 border-top bg-light d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Showing 1-{trains.length} of {trains.length} trains
                        </small>
                        <small className="text-muted">Rows per page: 10</small>
                    </div>
                </div>
            </div>

            {/* Edit/Add Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    {editTrain?.trainId ? "Edit Train" : "Add New Train"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditTrain(null);
                                    }}
                                ></button>
                            </div>

                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Train Name *</label>
                                        <input
                                            type="text"
                                            value={editTrain?.trainName || ""}
                                            onChange={(e) =>
                                                setEditTrain({ ...editTrain, trainName: e.target.value })
                                            }
                                            placeholder="Enter train name"
                                            className="form-control"
                                            style={{ borderRadius: "8px" }}
                                            maxLength={50}
                                            required
                                        />
                                        <small className="text-muted">2-50 characters</small>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Train Model *</label>
                                        <input
                                            type="text"
                                            value={editTrain?.trainModel || ""}
                                            onChange={(e) =>
                                                setEditTrain({ ...editTrain, trainModel: e.target.value })
                                            }
                                            placeholder="Enter train model"
                                            className="form-control"
                                            style={{ borderRadius: "8px" }}
                                            maxLength={50}
                                            required
                                        />
                                        <small className="text-muted">2-50 characters</small>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Train Manufacturer</label>
                                        <input
                                            type="text"
                                            value={editTrain?.trainManufacturer || ""}
                                            onChange={(e) =>
                                                setEditTrain({ ...editTrain, trainManufacturer: e.target.value })
                                            }
                                            placeholder="Enter train manufacturer (optional)"
                                            className="form-control"
                                            style={{ borderRadius: "8px" }}
                                            maxLength={100}
                                        />
                                        <small className="text-muted">Optional, max 100 characters</small>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">
                                            Route Assignment
                                        </label>
                                        <select
                                            value={editTrain?.route?.id || ""}
                                            onChange={(e) => {
                                                const selectedRoute = routes.find(
                                                    (route) => route.id === parseInt(e.target.value)
                                                );
                                                setEditTrain({
                                                    ...editTrain,
                                                    route: selectedRoute || null
                                                });
                                            }}
                                            className="form-select"
                                            style={{ borderRadius: "8px" }}
                                            required={false}
                                        >
                                            <option value="">
                                                Select a route (optional)
                                            </option>
                                            {routes.map((route) => (
                                                <option key={route.id} value={route.id}>
                                                    {route.routeName}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="text-muted">
                                            Leave empty if not assigning to a route yet
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer border-0 pt-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditTrain(null);
                                    }}
                                    style={{ borderRadius: "8px" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                    style={{ borderRadius: "8px" }}
                                >
                                    {editTrain?.trainId ? "Update Train" : "Add Train"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTrainManager;