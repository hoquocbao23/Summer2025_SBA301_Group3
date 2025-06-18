import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import './routeOverview.css';
import { getStationName } from '../../data/stations.js';
import RouteService from '../../services/routeService';
import StationService from '../../services/stationService';

const colorMapping = {
  1: "#007bff", // Blue - Metro Line 1
  2: "#28a745", // Green - Metro Line 2  
  3: "#dc3545", // Red - Metro Line 3A
};

const lineLabels = {
  1: "BLUE LINE",
  2: "GREEN LINE", 
  3: "RED LINE"
};

export default function MetroServiceStatus() {
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = useState(null);
  const [expandedLines, setExpandedLines] = useState({});
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load routes and stations from API
  useEffect(() => {
    loadRoutesAndStations();
  }, []);

  const loadRoutesAndStations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load routes
      const routesResponse = await RouteService.getAllRoutes();
      console.log("API Routes Response:", routesResponse);
      
      let transformedRoutes = [];
      if (routesResponse.data?.routes && Array.isArray(routesResponse.data.routes)) {
        transformedRoutes = routesResponse.data.routes.map(route => 
          RouteService.transformFromApiFormat(route)
        );
      } else {
        transformedRoutes = [];
      }

      // Filter only active routes
      const activeRoutes = transformedRoutes.filter(route => route.status === "ACTIVE");
      setRoutes(activeRoutes);

      // Load stations
      try {
        const stationsResponse = await StationService.getAllStations();
        if (stationsResponse.data && Array.isArray(stationsResponse.data)) {
          setStations(stationsResponse.data);
        }
      } catch (stationError) {
        console.warn('Could not load stations from API, using fallback:', stationError);
        setStations([]);
      }

    } catch (error) {
      console.error('Error loading routes:', error);
      setError(`Failed to load routes: ${error.message}`);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  // Add refresh functionality
  const refreshData = () => {
    loadRoutesAndStations();
  };

  // Use API data instead of static data
  const activeRoutes = routes;
  const handleStationClick = (stationId, stationName) => {
    setSelectedStation({ id: stationId, name: stationName });
    // Here you would typically navigate to station details page
    console.log(`Navigating to station details for: ${stationName} (ID: ${stationId})`);
  };

  const toggleLineExpansion = (lineId) => {
    setExpandedLines(prev => ({
      ...prev,
      [lineId]: !prev[lineId]
    }));
  };

  // Helper function to get station name from API data or fallback
  const getStationNameById = (stationId) => {
    const station = stations.find(s => s.stationId === stationId);
    return station ? station.stationName : getStationName(stationId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="metro-container">
        <div className="metro-content">
          <div className="page-header">
            <h1 className="page-title">Service Status</h1>
            <p className="page-subtitle">Loading metro service information...</p>
          </div>
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="metro-container">
        <div className="metro-content">
          <div className="page-header">
            <h1 className="page-title">Service Status</h1>
            <p className="page-subtitle">Error loading metro service information</p>
          </div>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Unable to load service data</h4>
            <p>{error}</p>
            <button 
              className="btn btn-outline-danger" 
              onClick={loadRoutesAndStations}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  const LineCard = ({ route }) => {
    const isExpanded = expandedLines[route.routeId];
    const lineColor = route.color || colorMapping[route.routeId];
    
    return (
      <div className="line-card">
        {/* Header */}        <div 
          className="line-header"
          onClick={() => toggleLineExpansion(route.routeId)}
        >
          <div className="line-info">
            <div 
              className="line-icon"
              style={{ backgroundColor: lineColor }}
            >
              <Train size={20} />
            </div>
            <div className="line-details">
              <h3 className="line-title">{route.routeName}</h3>
              <p className="line-label">{route.routeDescription || 'METRO LINE'}</p>
            </div>
          </div>
          <div className="line-status">
            <span className="status-badge">
              Normal Service
            </span>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="expanded-content">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Distance:</span>
                <p className="stat-value">{route.totalDistance} km</p>
              </div>              <div className="stat-item">
                <span className="stat-label">Duration:</span>
                <p className="stat-value">{route.estimatedDuration} min</p>
              </div>
              <div className="stat-item">
                <span className="stat-label">Frequency:</span>
                <p className="stat-value">{route.frequencyMinutes} min</p>
              </div>
              <div className="stat-item">
                <span className="stat-label">Hours:</span>
                <p className="stat-value">{route.operatingHours}</p>
              </div>
            </div>
            
            {/* Stations Route */}
            <div className="stations-section">
              <h4 className="stations-title">Stations Route:</h4>              
              <div className="stations-route">
                {route.stations.map((station, index) => {
                  const stationName = getStationNameById(station.stationId);
                  return (
                    <div key={station.stationId} className="station-container">
                      <button
                        onClick={() => navigate(`/stations/${station.stationId}`)}
                        className="station-button"
                      >
                        <div 
                          className="station-dot expanded"
                          style={{ backgroundColor: lineColor }}
                        />
                        <div className="station-tooltip">
                          {stationName}
                        </div>
                      </button>
                      {index < route.stations.length - 1 && (
                        <div 
                          className="station-connector expanded"
                          style={{ backgroundColor: lineColor }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Always visible mini route */}
        {!isExpanded && (
          <div className="mini-route">            
            <div className="mini-stations">
              {route.stations.map((station, index) => {
                const stationName = getStationNameById(station.stationId);
                return (
                  <div key={station.stationId} className="mini-station-container">
                    <button
                      onClick={() => navigate(`/stations/${station.stationId}`)}
                      className="station-button"
                    >
                      <div 
                        className="station-dot mini"
                        style={{ backgroundColor: lineColor }}
                      />
                      <div className="station-tooltip mini">
                        {stationName}
                      </div>
                    </button>
                    {index < route.stations.length - 1 && (
                      <div 
                        className="station-connector mini"
                        style={{ backgroundColor: lineColor }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="metro-container">
      <div className="metro-content">
        {/* Header */}
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">Service Status</h1>
              <p className="page-subtitle">Real-time status of Ho Chi Minh City Metro lines</p>
            </div>
            <button 
              onClick={refreshData}
              className="btn btn-outline-primary"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Overview Bar */}        
        <div className="overview-bar">
          <div className="overview-content">
            {activeRoutes.map((route) => (
              <div key={route.routeId} className="overview-item">
                <div 
                  className="overview-icon"
                  style={{ backgroundColor: route.color || colorMapping[route.routeId] }}
                  onClick={() => toggleLineExpansion(route.routeId)}
                >
                  <Train size={18} />
                </div>
                <div className="overview-details">
                  <div className="overview-title">{route.routeName}</div>
                  {/* <div className="overview-label">{route.routeDescription || 'METRO LINE'}</div> */}
                  <div className="overview-status">
                    <Circle className="status-dot" />
                    <span className="status-text">Normal Service</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>        
        {/* Line Details */}
        <div className="lines-container">
          {activeRoutes.length > 0 ? (
            activeRoutes.map((route) => (
              <LineCard key={route.routeId} route={route} />
            ))
          ) : (
            <div className="no-routes-message">
              <h3>No Active Routes</h3>
              <p>There are currently no active metro routes available.</p>
            </div>
          )}
        </div>

        {/* Selected Station Info */}
        {selectedStation && (
          <div className="selected-station">
            <h4 className="selected-title">Selected Station</h4>
            <p className="selected-name">{selectedStation.name}</p>
            <button 
              onClick={() => setSelectedStation(null)}
              className="close-button"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}