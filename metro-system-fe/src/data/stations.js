// Available stations for routes (basic info)
export const availableStations = [
  { id: 1, name: "Ben Thanh", location: { lat: 10.7718, long: 106.6983 } },
  { id: 2, name: "Ba Son", location: { lat: 10.7805, long: 106.7081 } },
  { id: 3, name: "Hiep Thanh", location: { lat: 10.7902, long: 106.7155 } },
  { id: 4, name: "Thao Dien", location: { lat: 10.7991, long: 106.7223 } },
  { id: 5, name: "An Phu", location: { lat: 10.8055, long: 106.7301 } },
  { id: 6, name: "Tan Cang", location: { lat: 10.7662, long: 106.7025 } },
  { id: 7, name: "Thu Thiem", location: { lat: 10.7889, long: 106.7278 } },
  { id: 8, name: "Saigon Bridge", location: { lat: 10.7745, long: 106.7189 } },
]

// Full station data for station management
export const initialStations = [
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
  {
    id: 6,
    name: "Tan Cang",
    location: { lat: 10.7662, long: 106.7025 },
    gates: 3,
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    status: "Active",
  },
  {
    id: 7,
    name: "Thu Thiem",
    location: { lat: 10.7889, long: 106.7278 },
    gates: 2,
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    status: "Active",
  },
  {
    id: 8,
    name: "Saigon Bridge",
    location: { lat: 10.7745, long: 106.7189 },
    gates: 4,
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    status: "Active",
  },
]

// Helper function to get station by ID
export const getStationById = (stationId) => {
  return initialStations.find(station => station.id === stationId)
}

// Helper function to get station name by ID
export const getStationName = (stationId) => {
  const station = getStationById(stationId)
  return station ? station.name : 'Unknown Station'
}

// Helper functions for station management
export const getActiveStations = () => {
  return initialStations.filter(station => station.status === "Active")
}

export const getStationsByStatus = (status) => {
  return initialStations.filter(station => station.status === status)
}

// Helper function to get station statistics
export const getStationStats = () => {
  const total = initialStations.length
  const active = initialStations.filter(s => s.status === "Active").length
  const inactive = initialStations.filter(s => s.status === "Inactive").length
  const totalGates = initialStations.reduce((sum, station) => sum + station.gates, 0)
  
  return { total, active, inactive, totalGates }
}
