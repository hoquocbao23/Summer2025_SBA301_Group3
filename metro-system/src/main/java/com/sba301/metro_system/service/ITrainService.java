package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.train.TrainRequestDTO;
import com.sba301.metro_system.dto.response.train.TrainResponseDTO;
import com.sba301.metro_system.entity.Train;

import java.util.List;

public interface ITrainService {
    List<Train> findAll();
    Train findById(Long id);
    Train saveWithRout(Long id,TrainResponseDTO train);
    void delete(Long id);
    Train update(Long id,Train train);

    Train save(TrainRequestDTO trainRequestDTO);
}
