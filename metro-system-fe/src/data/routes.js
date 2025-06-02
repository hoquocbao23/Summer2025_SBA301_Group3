// Initial routes data
export const initialRoutes = [
  {
    id: 1,
    name: "Metro Line 1",
    description: "Ben Thanh - Suoi Tien route connecting central HCMC to Thu Duc",
    status: "Active",
    color: "#007bff",
    totalDistance: 19.7,
    estimatedTime: 30,
    operatingHours: "05:00 - 23:00",
    frequency: "3-5 minutes",
    ticketPrice: 15000,
    stations: [
      { stationId: 1, order: 1, distanceFromPrevious: 0 },
      { stationId: 2, order: 2, distanceFromPrevious: 1.2 },
      { stationId: 6, order: 3, distanceFromPrevious: 1.8 },
      { stationId: 3, order: 4, distanceFromPrevious: 2.1 },
      { stationId: 4, order: 5, distanceFromPrevious: 1.9 },
      { stationId: 5, order: 6, distanceFromPrevious: 1.4 },
    ],
  },
  {
    id: 2,
    name: "Metro Line 2",
    description: "Ben Thanh - Tham Luong route serving western districts",
    status: "Planning",
    color: "#28a745",
    totalDistance: 11.3,
    estimatedTime: 25,
    operatingHours: "05:30 - 22:30",
    frequency: "4-6 minutes",
    ticketPrice: 12000,
    stations: [
      { stationId: 1, order: 1, distanceFromPrevious: 0 },
      { stationId: 8, order: 2, distanceFromPrevious: 2.1 },
      { stationId: 7, order: 3, distanceFromPrevious: 1.8 },
    ],
  },
  {
    id: 3,
    name: "Metro Line 3A",
    description: "Hanoi-style express line for future expansion",
    status: "Inactive",
    color: "#dc3545",
    totalDistance: 8.5,
    estimatedTime: 15,
    operatingHours: "06:00 - 22:00",
    frequency: "5-8 minutes",
    ticketPrice: 10000,
    stations: [
      { stationId: 2, order: 1, distanceFromPrevious: 0 },
      { stationId: 3, order: 2, distanceFromPrevious: 2.8 },
    ],
  },
  {
    id: 4,
    name: "Metro Line 4",
    description: "HCM-style express line for future expansion",
    status: "Active",
    color: "#007bff",
    totalDistance: 19.7,
    estimatedTime: 30,
    operatingHours: "05:00 - 23:00",
    frequency: "3-5 minutes",
    ticketPrice: 15000,
    stations: [
      { stationId: 1, order: 1, distanceFromPrevious: 0 },
      { stationId: 2, order: 2, distanceFromPrevious: 1.2 },
      { stationId: 6, order: 3, distanceFromPrevious: 1.8 },
      { stationId: 3, order: 4, distanceFromPrevious: 2.1 },
      { stationId: 4, order: 5, distanceFromPrevious: 1.9 },
      { stationId: 5, order: 6, distanceFromPrevious: 1.4 },
    ],
  },
]

// Helper functions for routes
export const getRouteById = (routeId) => {
  return initialRoutes.find(route => route.id === routeId)
}

export const getActiveRoutes = () => {
  return initialRoutes.filter(route => route.status === "Active")
}

export const getRoutesByStatus = (status) => {
  return initialRoutes.filter(route => route.status === status)
}

// Helper function to get route statistics
export const getRouteStats = () => {
  const total = initialRoutes.length
  const active = initialRoutes.filter(r => r.status === "Active").length
  const planning = initialRoutes.filter(r => r.status === "Planning").length
  const inactive = initialRoutes.filter(r => r.status === "Inactive").length
  
  return { total, active, planning, inactive }
}
