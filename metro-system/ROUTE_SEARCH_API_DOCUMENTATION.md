# Route Search API Documentation

## Overview
API này cho phép tìm kiếm các tuyến đường giữa 2 trạm và tính toán tổng chi phí của chuyến đi. Kết quả được sắp xếp theo giá tiền tăng dần.

## Endpoints

### 1. Search Routes (POST)
**Endpoint:** `POST /api/routes/search`

**Description:** Tìm tất cả các tuyến đường có sẵn giữa 2 trạm, được sắp xếp theo giá tiền tăng dần.

**Request Body:**
```json
{
  "sourceStationId": 1,
  "destinationStationId": 5
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Routes found successfully",
  "data": {
    "sourceStationId": 1,
    "sourceStationName": "Ga Hà Nội",
    "destinationStationId": 5,
    "destinationStationName": "Ga Thanh Xuân",
    "availableRoutes": [
      {
        "routeId": 1,
        "routeName": "Tuyến số 1",
        "routeDescription": "Tuyến đường chính từ trung tâm",
        "color": "#FF0000",
        "totalDistance": 15.5,
        "estimatedDuration": 45,
        "totalPrice": 25000.00,
        "stations": [
          {
            "stationId": 1,
            "stationName": "Ga Hà Nội",
            "stationLocation": "Hoàn Kiếm, Hà Nội",
            "stationOrder": 1,
            "distanceToNext": 2.5
          },
          {
            "stationId": 2,
            "stationName": "Ga Trung tâm",
            "stationLocation": "Hai Bà Trưng, Hà Nội",
            "stationOrder": 2,
            "distanceToNext": 3.0
          },
          {
            "stationId": 5,
            "stationName": "Ga Thanh Xuân",
            "stationLocation": "Thanh Xuân, Hà Nội",
            "stationOrder": 5,
            "distanceToNext": null
          }
        ]
      }
    ],
    "totalRoutesFound": 1
  }
}
```

### 2. Search Routes (GET)
**Endpoint:** `GET /api/routes/search?sourceStationId=1&destinationStationId=5`

**Description:** Tương tự như POST endpoint nhưng sử dụng query parameters.

**Query Parameters:**
- `sourceStationId` (required): ID của trạm xuất phát
- `destinationStationId` (required): ID của trạm đích

**Response:** Giống như POST endpoint

## Business Logic

### 1. Tìm kiếm tuyến đường
- Hệ thống tìm tất cả các tuyến (routes) có chứa cả 2 trạm xuất phát và đích
- Chỉ xem xét các tuyến có trạng thái ACTIVE
- Đảm bảo trạm xuất phát đứng trước trạm đích trong thứ tự của tuyến

### 2. Tính toán giá tiền
Công thức tính giá:
```
Tổng giá tiền = Giá cơ bản (basePrice) + (Tổng khoảng cách × Giá theo km)
```

Trong đó:
- `basePrice`: Giá cơ bản từ TicketRule của route
- `pricePerKm`: Giá theo km từ TicketRule của route
- `Tổng khoảng cách`: Tổng khoảng cách từ trạm xuất phát đến trạm đích

### 3. Sắp xếp kết quả
- Kết quả được sắp xếp theo tổng giá tiền tăng dần
- Nếu có nhiều tuyến với cùng giá, thứ tự sẽ theo ID của route

### 4. Thông tin trả về
Mỗi tuyến đường trong kết quả bao gồm:
- Thông tin cơ bản của tuyến (ID, tên, mô tả, màu sắc)
- Tổng khoảng cách và thời gian ước tính
- Tổng giá tiền đã tính toán
- Danh sách các trạm từ xuất phát đến đích (bao gồm cả trạm trung gian)

## Error Handling

### 404 Not Found
```json
{
  "status": 404,
  "message": "Source station not found"
}
```

### 400 Bad Request
```json
{
  "status": 400,
  "message": "Validation failed",
  "data": {
    "sourceStationId": "Source station ID is required"
  }
}
```

## Example Usage

### Tìm tuyến từ ga A đến ga B
```bash
curl -X POST http://localhost:8080/api/routes/search \
  -H "Content-Type: application/json" \
  -d '{
    "sourceStationId": 1,
    "destinationStationId": 5
  }'
```

### Sử dụng GET với query parameters
```bash
curl "http://localhost:8080/api/routes/search?sourceStationId=1&destinationStationId=5"
```
