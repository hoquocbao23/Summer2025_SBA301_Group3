package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.train.TrainRequestDTO;
import com.sba301.metro_system.dto.response.train.TrainResponseDTO;

import java.util.List;

public interface ITrainService {
    List<TrainResponseDTO> findAll();

    TrainResponseDTO findById(Long id);

    void delete(Long id);

    TrainResponseDTO update(Long id, TrainRequestDTO trainRequestDTO,Long idRoute);

    TrainResponseDTO save(TrainRequestDTO trainRequestDTO);

    // Validation methods
    void validateTrainData(TrainRequestDTO trainRequestDTO);

    void validateTrainExists(Long trainId);

    void validateTrainName(String trainName);

    void validateTrainModel(String trainModel);
}
