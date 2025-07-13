package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.station.StationDTO;
import com.sba301.metro_system.entity.Station;

public interface IStationService {
    public ResponseApi<?> getAllStations();
    public ResponseApi<?> getStationById(Long id);
    public ResponseApi<?> createStation(StationDTO stationDTO);
    public ResponseApi<?> updateStation(StationDTO stationDTO, Long id);
    public ResponseApi<?> deleteStation(Long id);

    public Station findStationById(Long id);

}
