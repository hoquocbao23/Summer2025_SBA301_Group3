package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.response.StationResponseDto;
import com.sba301.metro_system.entity.Station;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class StationMapper {

    public StationResponseDto toResponseDto(Station station) {
        if (station == null) {
            return null;
        }

        return StationResponseDto.builder()
                .stationId(station.getStationId())
                .stationName(station.getStationName())
                .stationLocation(station.getStationLocation())
                .description(station.getDescription())
                .status(station.getStatus())
                .imageUrl(station.getImageUrl())
                .build();
    }

    public List<StationResponseDto> toResponseDtoList(List<Station> stations) {
        if (stations == null) {
            return null;
        }

        return stations.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }
}
