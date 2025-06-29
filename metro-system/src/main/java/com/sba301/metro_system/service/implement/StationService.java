package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.station.StationDTO;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.entity.UserPrinciple;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.repository.StationRepository;
import com.sba301.metro_system.service.IStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StationService implements IStationService {

    @Autowired
    private StationRepository stationRepository;

    @Override
    public ResponseApi<?> getAllStations() {
        List<Station> station= stationRepository.findAll();
        return ResponseApi.
                builder().
                status(HttpStatus.OK.value()).
                message(HttpStatus.OK.getReasonPhrase()).
                data(station).
                build();
    }

    @Override
    public ResponseApi<?> getStationById(Long id) {
        Optional<Station> stationOptional = stationRepository.findById(id);

        if (stationOptional.isEmpty()) {
            return ResponseApi.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message(HttpStatus.NOT_FOUND.getReasonPhrase())
                    .data("Not found Station with id " + id)
                    .build();
        }

        Station station = stationOptional.get();
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(station)
                .build();
    }


    @Override
    public ResponseApi<?> createStation(StationDTO stationDTO) {
        UserPrinciple user = (UserPrinciple) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(user==null){
            return ResponseApi.
                    builder().
                    status(HttpStatus.UNAUTHORIZED.value()).
                    message(HttpStatus.UNAUTHORIZED.getReasonPhrase()).
                    data("UNAUTHORIZED").
                    build();
        }
        Station station = new Station(stationDTO.getStationName(),stationDTO.getStationLocation(),stationDTO.getUrl(),stationDTO.getStatus(),stationDTO.getDescription());

        return ResponseApi.
                builder().
                status(HttpStatus.CREATED.value()).
                message(HttpStatus.CREATED.getReasonPhrase()).
                data(stationRepository.save(station)).
                build();
    }

    @Override
    public ResponseApi<?> updateStation(StationDTO stationDTO, Long id) {
        Optional<Station> optionalStation = stationRepository.findById(id);
        if (optionalStation.isEmpty()) {
            return ResponseApi.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(HttpStatus.BAD_REQUEST.getReasonPhrase())
                    .data("Not found Station with id " + id)
                    .build();
        }

        Station station = optionalStation.get();
        station.setStationName(stationDTO.getStationName());
        station.setStationLocation(stationDTO.getStationLocation());
        station.setUrl(stationDTO.getUrl());
        station.setStatus(stationDTO.getStatus());
        station.setDescription(stationDTO.getDescription());
        stationRepository.save(station);

        return ResponseApi.builder()
                .status(HttpStatus.NO_CONTENT.value())
                .message(HttpStatus.NO_CONTENT.getReasonPhrase())
                .data(station)
                .build();
    }

    @Override
    public ResponseApi<?> deleteStation(Long id) {
        Station station = stationRepository.findById(id).get();
        station.setStatus(Status.INACTIVE);
        return ResponseApi.
                builder().
                status(HttpStatus.NO_CONTENT.value()).
                message(HttpStatus.NO_CONTENT.getReasonPhrase()).
                data(station).
                build();
    }
}
