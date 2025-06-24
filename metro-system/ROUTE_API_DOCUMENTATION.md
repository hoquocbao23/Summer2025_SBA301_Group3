# Route Management API Documentation

## Overview
The Route Management API provides comprehensive functionality for managing metro routes, including basic route operations and station-route associations.

## Features

### 1. Basic Route Management
- **Create Route**: Create a new metro route with basic information
- **Update Route**: Update existing route details
- **Delete Route**: Soft delete a route (marks as deleted but keeps data)
- **Get Route**: Retrieve a specific route with its stations
- **Get All Routes**: Retrieve all active routes

### 2. Station-Route Management
- **Add Stations to Route**: Associate multiple stations with a route including order and distances
- **Update Route Stations**: Replace all stations for a route
- **Remove All Stations**: Remove all stations from a route
- **Get Route with Stations**: Retrieve route with detailed station information

### 3. Search and Utility Functions
- **Search Routes by Name**: Find routes by name keyword
- **Get Routes by Ticket Rule**: Find routes using specific ticket rules
- **Get Route by Name**: Retrieve route by exact name
- **Check Route Name Existence**: Validate if route name already exists

## API Endpoints

### Route Management

#### Create Route
```http
POST /api/routes
Content-Type: application/json

{
  "routeName": "Line 1 - Ben Thanh to Suoi Tien",
  "routeDescription": "Main metro line connecting city center to eastern districts",
  "ruleId": 1,
  "estimatedDuration": 45,
  "frequencyMinutes": 5
}
```

#### Update Route
```http
PUT /api/routes/{routeId}
Content-Type: application/json

{
  "routeName": "Line 1 - Ben Thanh to Suoi Tien (Updated)",
  "routeDescription": "Updated description",
  "ruleId": 1,
  "estimatedDuration": 50,
  "frequencyMinutes": 4
}
```

#### Get Route
```http
GET /api/routes/{routeId}
```

#### Get All Routes
```http
GET /api/routes
```

#### Delete Route
```http
DELETE /api/routes/{routeId}
```

### Station Route Management

#### Add Stations to Route
```http
POST /api/routes/stations
Content-Type: application/json

{
  "routeId": 1,
  "stations": [
    {
      "stationId": 1,
      "stationOrder": 1,
      "distanceToNext": 1.5
    },
    {
      "stationId": 2,
      "stationOrder": 2,
      "distanceToNext": 2.0
    }
  ]
}
```

#### Update Route Stations
```http
PUT /api/routes/stations
Content-Type: application/json

{
  "routeId": 1,
  "stations": [
    {
      "stationId": 1,
      "stationOrder": 1,
      "distanceToNext": 1.5
    },
    {
      "stationId": 3,
      "stationOrder": 2,
      "distanceToNext": 1.8
    }
  ]
}
```

#### Get Route with Stations
```http
GET /api/routes/{routeId}/stations
```

#### Remove All Stations from Route
```http
DELETE /api/routes/{routeId}/stations
```

### Search and Utility

#### Search Routes by Name
```http
GET /api/routes/search?keyword=Line
```

#### Get Routes by Ticket Rule
```http
GET /api/routes/by-ticket-rule/{ticketRuleId}
```

#### Get Route by Name
```http
GET /api/routes/by-name/{routeName}
```

#### Check Route Name Existence
```http
GET /api/routes/exists/{routeName}
```

## Request/Response Models

### RouteRequest
```json
{
  "routeName": "string (required, 3-100 chars)",
  "routeDescription": "string (optional, max 500 chars)",
  "ruleId": "number (required, positive)",
  "estimatedDuration": "number (required, 1-300 minutes)",
  "frequencyMinutes": "number (required, 1-60 minutes)"
}
```

### RouteResponse
```json
{
  "routeId": "number",
  "routeName": "string",
  "routeDescription": "string",
  "ticketRule": {
    "ruleId": "number",
    "ruleName": "string",
    "basePrice": "number",
    "pricePerKm": "number",
    "status": "string"
  },
  "totalDistance": "number",
  "estimatedDuration": "number",
  "frequencyMinutes": "number",
  "stations": [
    {
      "stationId": "number",
      "stationOrder": "number",
      "distanceToNext": "number",
      "stationName": "string",
      "stationLocation": "string"
    }
  ]
}
```

### RouteListResponse
```json
{
  "routes": ["RouteResponse array"],
  "totalCount": "number",
  "message": "string"
}
```

### RouteStationRequest
```json
{
  "routeId": "number (required, positive)",
  "stations": [
    {
      "stationId": "number (required, positive)",
      "stationOrder": "number (required, min 1)",
      "distanceToNext": "number (optional, 0-50 km)"
    }
  ]
}
```

## Validation Rules

### Route Validation
- **Route Name**: Required, 3-100 characters, must be unique
- **Route Description**: Optional, max 500 characters
- **Rule ID**: Required, must reference existing ticket rule
- **Estimated Duration**: Required, 1-300 minutes
- **Frequency**: Required, 1-60 minutes

### Station Route Validation
- **Route ID**: Required, must reference existing route
- **Station ID**: Required, must reference existing station
- **Station Order**: Required, minimum 1, must be unique within route
- **Distance to Next**: Optional, 0-50 km

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "status": 400,
  "message": "Validation failed",
  "data": null
}
```

#### 404 Not Found
```json
{
  "status": 404,
  "message": "Route not found with ID: 1",
  "data": null
}
```

#### 409 Conflict
```json
{
  "status": 409,
  "message": "Route name already exists: Line 1",
  "data": null
}
```

## Business Rules

1. **Route Names must be unique** across the system
2. **Soft Delete**: Routes are marked as deleted but not physically removed
3. **Total Distance Calculation**: Automatically calculated from station distances
4. **Station Order**: Must be sequential and unique within a route
5. **Ticket Rule Association**: Each route must have a valid ticket rule
6. **Station Validation**: Stations must exist before adding to route

## Dependencies

- **TicketRule**: Routes must reference valid ticket rules
- **Station**: Station routes must reference valid stations
- **Database**: PostgreSQL with JPA/Hibernate
- **Validation**: Jakarta Bean Validation
- **Documentation**: OpenAPI 3.0 (Swagger)

## Security Considerations

- Input validation on all endpoints
- SQL injection prevention through parameterized queries
- Soft delete to maintain data integrity
- Transaction management for consistency

## Testing

The API includes comprehensive unit tests covering:
- Service layer functionality
- Validation scenarios
- Error handling
- Edge cases
- Mock integrations

Run tests with:
```bash
./mvnw test
```

## Getting Started

1. Ensure database is configured
2. Run the application: `./mvnw spring-boot:run`
3. Access Swagger UI: `http://localhost:8080/swagger-ui.html`
4. Test endpoints using the interactive documentation
