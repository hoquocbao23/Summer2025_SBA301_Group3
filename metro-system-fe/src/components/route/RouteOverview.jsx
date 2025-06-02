import React, { useState } from 'react';
import { Train, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import './routeOverview.css';
import { initialRoutes, getActiveRoutes } from '../../data/routes.js';
import { getStationName } from '../../data/stations.js';

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
  const [selectedStation, setSelectedStation] = useState(null);
  const [expandedLines, setExpandedLines] = useState({});

  // Use helper function to get active routes
  const activeRoutes = getActiveRoutes();

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

  const LineCard = ({ route }) => {
    const isExpanded = expandedLines[route.id];
    const lineColor = colorMapping[route.id] || route.color;
    
    return (
      <div className="line-card">
        {/* Header */}
        <div 
          className="line-header"
          onClick={() => toggleLineExpansion(route.id)}
        >
          <div className="line-info">
            <div 
              className="line-icon"
              style={{ backgroundColor: lineColor }}
            >
              <Train size={20} />
            </div>
            <div className="line-details">
              <h3 className="line-title">{route.name}</h3>
              <p className="line-label">{lineLabels[route.id] || 'METRO LINE'}</p>
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
              </div>
              <div className="stat-item">
                <span className="stat-label">Duration:</span>
                <p className="stat-value">{route.estimatedTime} min</p>
              </div>
              <div className="stat-item">
                <span className="stat-label">Frequency:</span>
                <p className="stat-value">{route.frequency}</p>
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
                  const stationName = getStationName(station.stationId);
                  return (
                    <div key={station.stationId} className="station-container">
                      <button
                        onClick={() => handleStationClick(station.stationId, stationName)}
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
                const stationName = getStationName(station.stationId);
                return (
                  <div key={station.stationId} className="mini-station-container">
                    <button
                      onClick={() => handleStationClick(station.stationId, stationName)}
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
          <h1 className="page-title">Service Status</h1>
          <p className="page-subtitle">Real-time status of Ho Chi Minh City Metro lines</p>
        </div>

        {/* Overview Bar */}
        <div className="overview-bar">
          <div className="overview-content">
            {activeRoutes.map((route) => (
              <div key={route.id} className="overview-item">
                <div 
                  className="overview-icon"
                  style={{ backgroundColor: colorMapping[route.id] || route.color }}
                  onClick={() => toggleLineExpansion(route.id)}
                >
                  <Train size={18} />
                </div>
                <div className="overview-details">
                  <div className="overview-title">{route.name}</div>
                  <div className="overview-label">{lineLabels[route.id] || 'METRO LINE'}</div>
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
          {activeRoutes.map((route) => (
            <LineCard key={route.id} route={route} />
          ))}
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