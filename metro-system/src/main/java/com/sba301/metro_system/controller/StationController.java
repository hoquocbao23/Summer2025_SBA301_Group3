package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.station.StationDTO;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.service.IStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    @PutMapping("{id}")
    public ResponseApi<?> updateStations(@PathVariable Long id, @RequestBody StationDTO body) {
        return stationService.updateStation(body, id);
    }
    @DeleteMapping("{id}")
    public ResponseApi<?> deleteStation(@PathVariable Long id) {
        return stationService.deleteStation(id);
    }
    @PostMapping()
    public ResponseApi<?> addStation(@RequestBody StationDTO body) {
        return stationService.createStation(body);
    }
}
