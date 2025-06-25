package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.train.TrainRequestDTO;
import com.sba301.metro_system.dto.response.train.TrainResponseDTO;
import com.sba301.metro_system.entity.Route;
import com.sba301.metro_system.entity.Train;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.repository.RouteRepository;
import com.sba301.metro_system.repository.TrainRepository;
import com.sba301.metro_system.service.ITrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TrainService implements ITrainService {

    @Autowired
    private TrainRepository trainRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Override
    public List<Train> findAll() {
        List<Train> trains= trainRepository.findAll();
        if(trains.isEmpty()){
            throw new NotFoundException("No trains found");
        }
        return trains;
    }

    @Override
    public Train findById(Long id) {
        Train train=trainRepository.findById(id).get();
        if(train==null){
            throw new NotFoundException("Train not found");
        }
        return train;
    }

    @Override
    public Train saveWithRout(Long id,TrainResponseDTO train) {
        Train newTrain=new Train();
        newTrain.setTrainName(train.getTrainName());
        newTrain.setTrainModel(train.getTrainModel());
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Route not found with ID: " + id));
        newTrain.setRoute(route);
        return trainRepository.save(newTrain);
    }

    @Override
    public void delete(Long id) {
         trainRepository.delete(trainRepository.findById(id).get());
    }

    @Override
    public Train update(Long id,Train train) {
         trainRepository.save(train);
         return train;
    }

    @Override
    public Train save(TrainRequestDTO trainRequestDTO) {
        Train newTrain=new Train();
        newTrain.setTrainName(trainRequestDTO.getTrainName());
        newTrain.setTrainModel(trainRequestDTO.getTrainModel());
        return trainRepository.save(newTrain);
    }
}
