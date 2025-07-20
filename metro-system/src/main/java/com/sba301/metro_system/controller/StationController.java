package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.station.StationDTO;
import com.sba301.metro_system.dto.response.StationResponseDto;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.service.IStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/stations")
public class StationController {

    @Autowired
    private IStationService stationService;

    @GetMapping
    public ResponseEntity<ResponseApi<List<StationResponseDto>>> getAllStations() {
        List<StationResponseDto> stations = stationService.getAllStations();
        ResponseApi<List<StationResponseDto>> response = ResponseApi.<List<StationResponseDto>>builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(stations)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("{id}")
    public ResponseEntity<ResponseApi<StationResponseDto>> getStationById(@PathVariable Long id) {
        StationResponseDto station = stationService.getStationById(id);
        ResponseApi<StationResponseDto> response = ResponseApi.<StationResponseDto>builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(station)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseApi<StationResponseDto>> updateStation(
            @PathVariable Long id,
            @RequestParam(value = "stationName", required = false) String stationName,
            @RequestParam(value = "stationLocation", required = false) String stationLocation,
            @RequestParam(value = "status", required = false) Status status,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        StationDTO stationDTO = new StationDTO();
        stationDTO.setStationName(stationName);
        stationDTO.setStationLocation(stationLocation);
        stationDTO.setStatus(status);
        stationDTO.setDescription(description);
        stationDTO.setImage(image);

        StationResponseDto updatedStation = stationService.updateStation(stationDTO, id);
        ResponseApi<StationResponseDto> response = ResponseApi.<StationResponseDto>builder()
                .status(HttpStatus.OK.value())
                .message("Station updated successfully")
                .data(updatedStation)
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ResponseApi<Void>> deleteStation(@PathVariable Long id) {
        stationService.deleteStation(id);
        ResponseApi<Void> response = ResponseApi.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Station deleted successfully")
                .data(null)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseApi<StationResponseDto>> addStation(
            @RequestParam(value = "stationName") String stationName,
            @RequestParam(value = "stationLocation") String stationLocation,
            @RequestParam(value = "status", required = false) Status status,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        StationDTO stationDTO = new StationDTO();
        stationDTO.setStationName(stationName);
        stationDTO.setStationLocation(stationLocation);
        stationDTO.setStatus(status != null ? status : Status.ACTIVE);
        stationDTO.setDescription(description);
        stationDTO.setImage(image);

        StationResponseDto createdStation = stationService.createStation(stationDTO);
        ResponseApi<StationResponseDto> response = ResponseApi.<StationResponseDto>builder()
                .status(HttpStatus.CREATED.value())
                .message("Station created successfully")
                .data(createdStation)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}