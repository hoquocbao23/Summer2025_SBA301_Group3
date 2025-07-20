package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.train.TrainRequestDTO;
import com.sba301.metro_system.dto.response.train.TrainResponseDTO;
import com.sba301.metro_system.entity.Route;
import com.sba301.metro_system.entity.Train;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.exception.TrainValidationException;
import com.sba301.metro_system.mapper.TrainMapper;
import com.sba301.metro_system.repository.RouteRepository;
import com.sba301.metro_system.repository.TrainRepository;
import com.sba301.metro_system.service.ITrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TrainService implements ITrainService {

    @Autowired
    private TrainRepository trainRepository;

    @Autowired
    private RouteRepository repository;

    @Autowired
    private TrainMapper trainMapper;

    @Override
    public List<TrainResponseDTO> findAll() {
        List<Train> trains = trainRepository.findAll();
        if (trains.isEmpty()) {
            throw new NotFoundException("No trains found in the system");
        }
        return trainMapper.toResponseDtoList(trains);
    }

    @Override
    public TrainResponseDTO findById(Long id) {
        validateTrainExists(id);

        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Train not found with id: " + id));
        return trainMapper.toResponseDto(train);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(Long id) {
        validateTrainExists(id);

        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Train not found with id: " + id));

        trainRepository.delete(train);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public TrainResponseDTO update(Long id, TrainRequestDTO trainRequestDTO,Long idRoute) {
//        validateTrainExists(id);
//        validateTrainData(trainRequestDTO);
//        validateTrainNameForUpdate(trainRequestDTO.getTrainName().trim(), id);

        Train existingTrain = trainRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Train not found with id: " + id));

        // Update train fields
        existingTrain.setTrainName(trainRequestDTO.getTrainName().trim());
        existingTrain.setTrainModel(trainRequestDTO.getTrainModel().trim());
        if (trainRequestDTO.getTrainManufacturer() != null
                && !trainRequestDTO.getTrainManufacturer().trim().isEmpty()) {
            existingTrain.setTrainManufacturer(trainRequestDTO.getTrainManufacturer().trim());
        }
        Route route= repository.findById(idRoute).orElseThrow(() -> new NotFoundException("Route not found with id: " + idRoute));
        existingTrain.setRoute(route);
        Train savedTrain = trainRepository.save(existingTrain);
        return trainMapper.toResponseDto(savedTrain);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public TrainResponseDTO save(TrainRequestDTO trainRequestDTO) {
        validateTrainData(trainRequestDTO);
        validateTrainName(trainRequestDTO.getTrainName().trim());

        Train newTrain = new Train();
        newTrain.setTrainName(trainRequestDTO.getTrainName().trim());
        newTrain.setTrainModel(trainRequestDTO.getTrainModel().trim());
        if (trainRequestDTO.getTrainManufacturer() != null
                && !trainRequestDTO.getTrainManufacturer().trim().isEmpty()) {
            newTrain.setTrainManufacturer(trainRequestDTO.getTrainManufacturer().trim());
        }

        Train savedTrain = trainRepository.save(newTrain);
        return trainMapper.toResponseDto(savedTrain);
    }

    // Validation methods implementation
    @Override
    public void validateTrainData(TrainRequestDTO trainRequestDTO) {
        if (trainRequestDTO == null) {
            throw new TrainValidationException("Train data cannot be null");
        }
        if (trainRequestDTO.getTrainName() == null || trainRequestDTO.getTrainName().trim().isEmpty()) {
            throw new TrainValidationException("Train name is required");
        }
        if (trainRequestDTO.getTrainModel() == null || trainRequestDTO.getTrainModel().trim().isEmpty()) {
            throw new TrainValidationException("Train model is required");
        }

        // Validate individual fields
        validateTrainName(trainRequestDTO.getTrainName().trim());
        validateTrainModel(trainRequestDTO.getTrainModel().trim());

        // Validate manufacturer if provided
        if (trainRequestDTO.getTrainManufacturer() != null
                && !trainRequestDTO.getTrainManufacturer().trim().isEmpty()) {
            validateTrainManufacturer(trainRequestDTO.getTrainManufacturer().trim());
        }
    }

    @Override
    public void validateTrainExists(Long trainId) {
        if (trainId == null) {
            throw new TrainValidationException("Train ID cannot be null");
        }
        if (trainId <= 0) {
            throw new TrainValidationException("Train ID must be a positive number");
        }
        if (!trainRepository.existsById(trainId)) {
            throw new NotFoundException("Train not found with id: " + trainId);
        }
    }

    @Override
    public void validateTrainName(String trainName) {
        if (trainName == null || trainName.trim().isEmpty()) {
            throw new TrainValidationException("Train name cannot be null or empty");
        }
        if (trainName.length() < 2) {
            throw new TrainValidationException("Train name must be at least 2 characters long");
        }
        if (trainName.length() > 50) {
            throw new TrainValidationException("Train name cannot exceed 50 characters");
        }

        // Check for invalid characters (allow letters, numbers, spaces, and basic
        // punctuation)
        if (!trainName.matches("^[a-zA-ZÀ-ỹĂăÂâÊêÔôƠơƯư0-9\\s.,'-]+$")) {
            throw new TrainValidationException("Train name contains invalid characters");
        }

        // Check for duplicate train name during creation
        if (trainRepository.existsByTrainName(trainName.trim())) {
            throw new TrainValidationException("Train with this name already exists");
        }
    }

    // Additional validation method for update (excludes current train)
    public void validateTrainNameForUpdate(String trainName, Long currentTrainId) {
        if (trainName == null || trainName.trim().isEmpty()) {
            throw new TrainValidationException("Train name cannot be null or empty");
        }
        if (trainName.length() < 2) {
            throw new TrainValidationException("Train name must be at least 2 characters long");
        }
        if (trainName.length() > 50) {
            throw new TrainValidationException("Train name cannot exceed 50 characters");
        }

        // Check for invalid characters
        if (!trainName.matches("^[a-zA-ZÀ-ỹĂăÂâÊêÔôƠơƯư0-9\\s.,'-]+$")) {
            throw new TrainValidationException("Train name contains invalid characters");
        }

        // Check for duplicate train name (excluding current train during update)
        Optional<Train> existingTrain = trainRepository.findByTrainName(trainName.trim());
        if (existingTrain.isPresent() && !existingTrain.get().getTrainId().equals(currentTrainId)) {
            throw new TrainValidationException("Train with this name already exists");
        }
    }

    @Override
    public void validateTrainModel(String trainModel) {
        if (trainModel == null || trainModel.trim().isEmpty()) {
            throw new TrainValidationException("Train model cannot be null or empty");
        }
        if (trainModel.length() < 2) {
            throw new TrainValidationException("Train model must be at least 2 characters long");
        }
        if (trainModel.length() > 50) {
            throw new TrainValidationException("Train model cannot exceed 50 characters");
        }

        // Check for valid model format (allow letters, numbers, hyphens, and basic
        // punctuation)
        if (!trainModel.matches("^[a-zA-Z0-9\\s.,-]+$")) {
            throw new TrainValidationException("Train model contains invalid characters");
        }
    }

    // Additional validation for manufacturer
    public void validateTrainManufacturer(String manufacturer) {
        if (manufacturer != null && !manufacturer.trim().isEmpty()) {
            if (manufacturer.length() > 100) {
                throw new TrainValidationException("Train manufacturer cannot exceed 100 characters");
            }

            // Check for valid manufacturer format
            if (!manufacturer.matches("^[a-zA-ZÀ-ỹĂăÂâÊêÔôƠơƯư0-9\\s.,&'-]+$")) {
                throw new TrainValidationException("Train manufacturer contains invalid characters");
            }
        }
    }
}
