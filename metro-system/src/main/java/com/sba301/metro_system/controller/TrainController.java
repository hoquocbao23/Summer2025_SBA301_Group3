package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.train.TrainRequestDTO;
import com.sba301.metro_system.dto.response.train.TrainResponseDTO;
import com.sba301.metro_system.entity.Train;
import com.sba301.metro_system.service.ITrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/train")
public class TrainController {
    @Autowired
    ITrainService trainService;

    @GetMapping()
    public ResponseApi<?> getAllTrains(){
        return  ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(trainService.findAll())
                .build();
    }

    @GetMapping("/{id}")
    public ResponseApi<?> getTrainById(@PathVariable Long id){
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(trainService.findById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ResponseApi<?> updateTrain(@PathVariable Long id, @RequestBody Train train){
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(trainService.update(id,train))
                .build();
    }
    @DeleteMapping("/{id}")
    public ResponseApi<?> delete(@PathVariable Long id){
        trainService.delete(id);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data("")
                .build();
    }
    @PostMapping("/{id}")
    public ResponseApi<?> createTrainWithRoute(@PathVariable Long routeId, @RequestBody TrainResponseDTO train){
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(trainService.saveWithRout(routeId,train))
                .build();
    }
    @PostMapping
    public ResponseApi<?> createTrain(@RequestBody TrainRequestDTO trainRequestDTO){
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(trainService.save(trainRequestDTO))
                .build();
    }
}
