package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.station.StationDTO;
import com.sba301.metro_system.dto.response.StationResponseDto;
import com.sba301.metro_system.entity.Station;

import java.util.List;

public interface IStationService {
    List<StationResponseDto> getAllStations();

    StationResponseDto getStationById(Long id);

    StationResponseDto createStation(StationDTO stationDTO);

    StationResponseDto updateStation(StationDTO stationDTO, Long id);

    void deleteStation(Long id);

    Station findStationById(Long id);

    // Validation methods
    void validateStationData(StationDTO stationDTO);

    void validateStationExists(Long stationId);

    void validateStationName(String stationName);

    void validateStationLocation(String stationLocation);

}
