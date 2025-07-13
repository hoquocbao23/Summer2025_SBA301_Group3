package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.station.StationDTO;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.service.IStationService;
import com.sba301.metro_system.enums.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/stations")
public class StationController {

    @Autowired
    private IStationService stationService;

    @GetMapping
    public ResponseApi<?> getAllStations() {
        return stationService.getAllStations();
    }

    @GetMapping("{id}")
    public ResponseApi<?> getStationById(@PathVariable Long id) {
        return stationService.getStationById(id);
    }

    @PutMapping(value = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseApi<?> updateStations(
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

        return stationService.updateStation(stationDTO, id);
    }

    @DeleteMapping("{id}")
    public ResponseApi<?> deleteStation(@PathVariable Long id) {
        return stationService.deleteStation(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseApi<?> addStation(
            @RequestParam(value = "stationName") String stationName,
            @RequestParam(value = "stationLocation") String stationLocation,
            @RequestParam(value = "status", required = false) Status status,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        StationDTO stationDTO = new StationDTO();
        stationDTO.setStationName(stationName);
        stationDTO.setStationLocation(stationLocation);
        stationDTO.setStatus(status != null ? status : Status.ACTIVE); // Mặc định ACTIVE nếu không có
        stationDTO.setDescription(description);
        stationDTO.setImage(image);

        return stationService.createStation(stationDTO);
    }
}