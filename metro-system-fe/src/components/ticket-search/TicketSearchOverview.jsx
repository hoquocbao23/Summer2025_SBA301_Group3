import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { TicketContext } from '../../pages/layout/TicketLayout';
import RouteSearchService from '../../services/routeSearchService';
import StationService from '../../services/stationService';
import './ticketSearchTool.css';

const TicketSearchOverview = ({ onStepChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price'); // 'price', 'time', 'distance'
  const [ticketsPerPage, setTicketsPerPage] = useState(5);
  const [recentSearches, setRecentSearches] = useState([]);
  const [stations, setStations] = useState([]);

  const { singleForm, setSingleForm } = useContext(TicketContext);

  // Load stations and perform search on component mount
  useEffect(() => {
    loadStations();
    if (singleForm?.fromStation && singleForm?.toStation) {
      performSearch();
    }
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse recent searches:', e);
      }
    }
  }, []);


  const loadStations = async () => {
    try {
      const response = await StationService.getAllStations();
      if (response.data && Array.isArray(response.data)) {
        setStations(response.data);
      }
    } catch (error) {
      console.warn('Could not load stations:', error);
    }
  };

  const getStationName = (stationId) => {
    const station = stations.find(s => s.stationId === stationId);
    return station ? station.stationName : `Station ${stationId}`;
  };

  const performSearch = async () => {
    if (!singleForm?.fromStation || !singleForm?.toStation) {
      setError('Please select both departure and destination stations');
      return;
    }

    if (singleForm.fromStation === singleForm.toStation) {
      setError('Departure and destination stations cannot be the same');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSelectedIndex(null);

      console.log('Searching routes from', singleForm.fromStation, 'to', singleForm.toStation);

      const response = await RouteSearchService.searchRoutes(
        singleForm.fromStationId,
        singleForm.toStationId
      );

      const transformedResults = RouteSearchService.transformSearchResults(response);
      setSearchResults(transformedResults);
      setCurrentPage(1);

      // Save to recent searches
      saveToRecentSearches(transformedResults);

    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      
      // Use mock data for development if API fails
      if (error.message.includes('Network error') || error.message.includes('CORS')) {
        console.warn('Using mock data due to API error');
        const mockResults = RouteSearchService.generateMockResults(
          singleForm.fromStation,
          singleForm.toStation
        );
        setSearchResults(mockResults);
        setCurrentPage(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToRecentSearches = (results) => {
    if (!results.sourceStation || !results.destinationStation) return;

    const newSearch = {
      id: Date.now(),
      sourceStationId: results.sourceStation.id,
      sourceStationName: results.sourceStation.name,
      destinationStationId: results.destinationStation.id,
      destinationStationName: results.destinationStation.name,
      pathsFound: results.totalPathsFound,
      searchTime: new Date().toISOString(),
      minPrice: results.paths.length > 0 ? Math.min(...results.paths.map(p => p.totalPrice)) : 0
    };

    const updated = [newSearch, ...recentSearches.filter(s => 
      !(s.sourceStationId === newSearch.sourceStationId && s.destinationStationId === newSearch.destinationStationId)
    )].slice(0, 5); // Keep only 5 recent searches

    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleBuyNow = () => {
    if (selectedIndex !== null && searchResults?.paths[selectedIndex]) {
      console.log("Proceeding to next step with selected route:", selectedIndex);
      console.log("Current singleForm:", singleForm);
      onStepChange(2);
    }
  };

  const handleRouteSelection = (index) => {
    
    setSelectedIndex(index) 
   
    // Update singleForm immediately when a route is selected
    if (searchResults?.paths[index]) {
      const selectedPath = searchResults.paths[index];
      console.log("Selected path:", selectedPath);
      
      const updatedSingleForm = {
        ...singleForm,
        totalPrice: selectedPath.totalPrice,
        totalDuration: selectedPath.totalDuration,
        totalDistance: selectedPath.totalDistance,
        transferCount: selectedPath.transferCount
      }
      setSingleForm(updatedSingleForm);
      console.log("Route selected - Updated singleForm:", {
        ...singleForm,
        totalPrice: selectedPath.totalPrice,
        totalDuration: selectedPath.totalDuration,
        totalDistance: selectedPath.totalDistance,
        transferCount: selectedPath.transferCount
      });
    }
  };

  const handleRecentSearchClick = (recentSearch) => {
    setSingleForm(prev => ({
      ...prev,
      fromStation: recentSearch.sourceStationId,
      toStation: recentSearch.destinationStationId,
      // Preserve ticketTypeId from previous state
      ticketTypeId: prev.ticketTypeId
    }));
    performSearch();
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleTicketsPerPageChange = (newPerPage) => {
    setTicketsPerPage(newPerPage);
    setCurrentPage(1);
  };

  // // Sort and paginate results
  // const getSortedPaths = () => {
  //   if (!searchResults?.paths) return [];
    
  //   const sorted = [...searchResults.paths].sort((a, b) => {
  //     switch (sortBy) {
  //       case 'price':
  //         return a.totalPrice - b.totalPrice;
  //       case 'time':
  //         return a.totalDuration - b.totalDuration;
  //       case 'distance':
  //         return a.totalDistance - b.totalDistance;
  //       default:
  //         return 0;
  //     }
  //   });
    
  //   return sorted;
  // };

  const originalPaths = searchResults?.paths || [];
  const totalPages = Math.ceil(originalPaths.length / ticketsPerPage);
  const startIdx = (currentPage - 1) * ticketsPerPage;
  const currentTickets = originalPaths.slice(startIdx, startIdx + ticketsPerPage);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Container fluid className="bg-light p-3">
      <Row>
        {/* Sidebar Filters + Recent */}
        <Col md={3}>
          {/* Search Controls */}
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">Search Options</h6>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="primary" 
                size="sm" 
                className="w-100 mb-2"
                onClick={performSearch}
                disabled={loading || !singleForm?.fromStation || !singleForm?.toStation}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Searching...
                  </>
                ) : (
                  'Search Routes'
                )}
              </Button>
              
              {searchResults && (
                <div className="text-center small text-muted">
                  {searchResults.totalRoutesFound} routes found
                </div>
              )}
            </Card.Body>
          </Card>

          <hr className="border-light my-4" />
          
          {/* Recent Searches */}
          <Row className="mb-3">
            <h5 className='mb-3'>Recent Searches</h5>
            {recentSearches.length > 0 ? (
              recentSearches.map((search) => (
                <Card 
                  key={search.id} 
                  className="mb-2 cursor-pointer" 
                  onClick={() => handleRecentSearchClick(search)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="p-2">
                    <div className="d-flex justify-content-between small fw-semibold">
                      <span>{search.sourceStationName}</span>
                      <span>{search.destinationStationName}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="text-muted small">
                        {search.pathsFound} routes found
                      </div>
                      <span className="text-danger fw-bold small">
                        from {formatPrice(search.minPrice)}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-muted small text-center">
                No recent searches
              </div>
            )}
          </Row>
        </Col>

        {/* Ticket Results */}
        <Col md={9} className="p-3">
          {/* Error Alert */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <Alert.Heading>Search Error</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}

          {/* Search Results Header */}
          {searchResults && (
            <Row className="mb-3 align-items-center">
              <Col md={6} className="text-start">
                <span>
                  {selectedIndex !== null ? `${selectedIndex + 1} of ` : ''}
                  {searchResults.totalPathsFound} routes found
                  {searchResults.sourceStation && searchResults.destinationStation && (
                    <span className="text-muted ms-2">
                      from {searchResults.sourceStation.name} to {searchResults.destinationStation.name}
                    </span>
                  )}
                </span>
              </Col>
              <Col md={6} className="text-end">
                <div className="d-flex justify-content-end align-items-center gap-3">
                  <div>
                    Sort by: 
                    <Button 
                      variant="link" 
                      size="sm" 
                      className={`p-1 ms-1 ${sortBy === 'price' ? 'text-danger fw-bold' : ''}`}
                      onClick={() => handleSortChange('price')}
                    >
                      price
                    </Button>
                    |
                    <Button 
                      variant="link" 
                      size="sm" 
                      className={`p-1 ${sortBy === 'time' ? 'text-danger fw-bold' : ''}`}
                      onClick={() => handleSortChange('time')}
                    >
                      time
                    </Button>
                    |
                    <Button 
                      variant="link" 
                      size="sm" 
                      className={`p-1 ${sortBy === 'distance' ? 'text-danger fw-bold' : ''}`}
                      onClick={() => handleSortChange('distance')}
                    >
                      distance
                    </Button>
                  </div>
                  <div>
                    Show:
                    <Form.Select 
                      size="sm" 
                      style={{ width: 'auto', display: 'inline-block' }}
                      className="ms-1"
                      value={ticketsPerPage}
                      onChange={(e) => handleTicketsPerPageChange(parseInt(e.target.value))}
                    >
                      <option value={5}>5 routes</option>
                      <option value={10}>10 routes</option>
                      <option value={20}>20 routes</option>
                    </Form.Select>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-2">Searching for routes...</div>
            </div>
          )}

          {/* No Results */}
          {!loading && searchResults && searchResults.paths.length === 0 && (
            <Card className="text-center py-5">
              <Card.Body>
                <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3">No Routes Found</h4>
                <p className="text-muted">
                  No routes available between the selected stations. 
                  Please try different stations or check back later.
                </p>
                <Button variant="primary" onClick={performSearch}>
                  Search Again
                </Button>
              </Card.Body>
            </Card>
          )}

          {/* Path Results */}
          {!loading && currentTickets.map((path, idx) => {
            console.log("Path:", path);
            console.log("currentTickets:", currentTickets);
            const actualIdx = startIdx + idx;
            return (
              <Card
                key={path.id}
                onClick={() => handleRouteSelection(actualIdx)}
                className={`mb-3 ${actualIdx === selectedIndex ? 'border border-danger' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body>
                  <Row>
                    <Col md={9} className="d-flex flex-column justify-content-center">
                      <Row>
                        <Col md={3} className="text-center">
                          <div style={{ fontSize: '2rem', color: '#007bff' }}>
                            <i className="bi bi-train-front-fill"></i>
                          </div>
                          <Card.Title className="h6">
                            {path.isDirectRoute ? 'Direct Route' : `${path.transferCount} Transfer${path.transferCount > 1 ? 's' : ''}`}
                          </Card.Title>
                          <Card.Subtitle className="text-muted small">
                            {path.segments?.length || 0} segment{(path.segments?.length || 0) !== 1 ? 's' : ''}
                          </Card.Subtitle>
                        </Col>
                        <Col md={9}>
                          <Row className="mb-2">
                            <Col md={4}>
                              <div className="text-muted small">From</div>
                              <div className="fw-bold">{searchResults.sourceStation?.name}</div>
                            </Col>
                            <Col md={4} className="text-center">
                              <div className="text-muted small">
                                <i className="bi bi-arrow-right" style={{ fontSize: '1.5rem' }}></i>
                              </div>
                              <div className="small text-muted">{formatDuration(path.totalDuration)}</div>
                            </Col>
                            <Col md={4}>
                              <div className="text-muted small">To</div>
                              <div className="fw-bold">{searchResults.destinationStation?.name}</div>
                            </Col>
                          </Row>
                          
                          {/* Path Details */}
                          <Row className="small text-muted">
                            <Col md={4}>
                              <i className="bi bi-geo-alt me-1"></i>
                              {path.totalDistance} km
                            </Col>
                            <Col md={4}>
                              <i className="bi bi-clock me-1"></i>
                              {path.totalDuration} min
                            </Col>
                            <Col md={4}>
                              <i className="bi bi-arrow-left-right me-1"></i>
                              {path.transferCount} transfer{path.transferCount !== 1 ? 's' : ''}
                            </Col>
                          </Row>

                          {/* Segments Path (for selected path) */}
                          {actualIdx === selectedIndex && path.segments && path.segments.length > 0 && (
                            console.log("path.segments:", path.segments),
                            <Row className="mt-3">
                              <Col>
                                <div className="small text-muted mb-2">Route details:</div>
                                {path.segments.map((segment, segIdx) => (
                                  <div key={segment.id} className="mb-2">
                                    <div className="d-flex align-items-center small">
                                      <div 
                                        className="me-2" 
                                        style={{ 
                                          width: '12px', 
                                          height: '12px', 
                                          backgroundColor: segment.color || '#007bff',
                                          borderRadius: '50%'
                                        }}
                                      ></div>
                                      <strong>{segment.routeName}</strong>
                                    </div>
                                    <div className="small text-muted ms-3">
                                      {segment.fromStation.name} → {segment.toStation.name}
                                      <span className="ms-2">
                                        ({segment.distance} km, {segment.duration} min, {formatPrice(segment.price)})
                                      </span>
                                    </div>
                                    {segIdx < path.segments.length - 1 && (
                                      <div className="small text-info ms-3 mt-1">
                                        <i className="bi bi-arrow-repeat me-1"></i>
                                        Transfer at {segment.toStation.name}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </Col>
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    
                    <Col md={3} style={{ borderLeft: "1px solid #b3acac" }} className="d-flex flex-column align-items-center justify-content-center">
                      <h4 className="text-danger mb-2">{formatPrice(path.totalPrice)}</h4>
                      <div className="mb-2 small text-center">
                        <div className="text-muted">per person</div>
                      </div>
                      <div className="mb-2 small text-center">
                        <i className="bi bi-wifi me-2 text-success" title="WiFi available"></i>
                        <i className="bi bi-cup me-2 text-primary" title="Refreshments"></i>
                        <i className="bi bi-shield-check me-2 text-warning" title="Safe travel"></i>
                      </div>
                      {actualIdx === selectedIndex && (
                        <Button 
                          variant="danger" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow();
                          }}
                        >
                          Buy Now
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.Prev 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => prev - 1)}
                />
                
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <Pagination.Ellipsis key={pageNum} />;
                  }
                  return null;
                })}
                
                <Pagination.Next 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                />
              </Pagination>
            </div>
          )}

          {/* Initial State */}
          {!loading && !searchResults && !error && (
            <Card className="text-center py-5">
              <Card.Body>
                <i className="bi bi-train-front" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                <h4 className="mt-3">Ready to Search</h4>
                <p className="text-muted">
                  Select your departure and destination stations above, then click "Search Routes" to find available routes.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TicketSearchOverview;
