package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.station.StationDTO;
import com.sba301.metro_system.dto.response.StationResponseDto;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.exception.StationValidationException;
import com.sba301.metro_system.mapper.StationMapper;
import com.sba301.metro_system.repository.StationRepository;
import com.sba301.metro_system.service.ICloudinaryService;
import com.sba301.metro_system.service.IStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StationService implements IStationService {

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private ICloudinaryService cloudinaryService;

    @Autowired
    private StationMapper stationMapper;

    @Override
    public List<StationResponseDto> getAllStations() {
        List<Station> stations = stationRepository.findAll();
        return stationMapper.toResponseDtoList(stations);
    }

    @Override
    public StationResponseDto getStationById(Long id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Station not found with id: " + id));
        return stationMapper.toResponseDto(station);
    }

    @Override
    public Station findStationById(Long id) {
        Optional<Station> stationOptional = stationRepository.findById(id);
        return stationOptional.orElseThrow(() -> new NotFoundException("Station is not found with id " + id));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public StationResponseDto createStation(StationDTO stationDTO) {
        validateStationData(stationDTO);

        if (stationRepository.existsByStationName(stationDTO.getStationName().trim())) {
            throw new StationValidationException("Station with this name already exists");
        }

        Station station = new Station();
        station.setStationName(stationDTO.getStationName().trim());
        station.setStationLocation(stationDTO.getStationLocation().trim());
        station.setDescription(stationDTO.getDescription() != null ? stationDTO.getDescription().trim() : null);
        station.setStatus(stationDTO.getStatus() != null ? stationDTO.getStatus() : Status.ACTIVE);

        MultipartFile image = stationDTO.getImage();
        if (image != null && !image.isEmpty()) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> uploadResult = (Map<String, Object>) cloudinaryService.upload(image,
                        "metro_stations");
                station.setImageUrl((String) uploadResult.get("secure_url"));
                station.setImagePublicId((String) uploadResult.get("public_id"));
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }

        // Lưu station vào database
        Station savedStation = stationRepository.save(station);
        return stationMapper.toResponseDto(savedStation);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public StationResponseDto updateStation(StationDTO stationDTO, Long id) {
        // Validation
        validateStationExists(id);
        validateStationData(stationDTO);

        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Station not found with id: " + id));

        // Check for duplicate station name (excluding current station)
        validateStationNameForUpdate(stationDTO.getStationName().trim(), id);

        station.setStationName(stationDTO.getStationName().trim());
        station.setStationLocation(stationDTO.getStationLocation().trim());
        station.setDescription(stationDTO.getDescription() != null ? stationDTO.getDescription().trim() : null);
        station.setStatus(stationDTO.getStatus() != null ? stationDTO.getStatus() : Status.ACTIVE);

        // Xử lý upload hình ảnh mới nếu có
        MultipartFile image = stationDTO.getImage();
        if (image != null && !image.isEmpty()) {
            try {
                // Xóa hình ảnh cũ nếu tồn tại
                if (station.getImagePublicId() != null) {
                    cloudinaryService.delete(station.getImagePublicId());
                }
                // Upload hình ảnh mới
                @SuppressWarnings("unchecked")
                Map<String, Object> uploadResult = (Map<String, Object>) cloudinaryService.upload(image,
                        "metro_stations");
                station.setImageUrl((String) uploadResult.get("secure_url"));
                station.setImagePublicId((String) uploadResult.get("public_id"));
            } catch (Exception e) {
                throw new RuntimeException("Failed to update image: " + e.getMessage());
            }
        }

        // Lưu thay đổi
        Station updatedStation = stationRepository.save(station);
        return stationMapper.toResponseDto(updatedStation);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteStation(Long id) {
        // Validation
        validateStationExists(id);

        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Station not found with id: " + id));

        // Xóa hình ảnh trên Cloudinary nếu tồn tại
        if (station.getImagePublicId() != null) {
            try {
                cloudinaryService.delete(station.getImagePublicId());
            } catch (Exception e) {
                throw new RuntimeException("Failed to delete image: " + e.getMessage());
            }
        }

        // Xóa cứng bản ghi
        stationRepository.delete(station);
    }

    // Validation methods implementation
    @Override
    public void validateStationData(StationDTO stationDTO) {
        if (stationDTO == null) {
            throw new StationValidationException("Station data cannot be null");
        }
        if (stationDTO.getStationName() == null || stationDTO.getStationName().trim().isEmpty()) {
            throw new StationValidationException("Station name is required");
        }
        if (stationDTO.getStationLocation() == null || stationDTO.getStationLocation().trim().isEmpty()) {
            throw new StationValidationException("Station location is required");
        }

        // Validate individual fields
        validateStationName(stationDTO.getStationName().trim());
        validateStationLocation(stationDTO.getStationLocation().trim());
        validateStationDescription(stationDTO.getDescription());

        // Validate status if provided
        if (stationDTO.getStatus() != null) {
            validateStationStatus(stationDTO.getStatus());
        }

        // Validate image if provided
        if (stationDTO.getImage() != null) {
            validateImageFile(stationDTO.getImage());
        }
    }

    @Override
    public void validateStationExists(Long stationId) {
        if (stationId == null) {
            throw new StationValidationException("Station ID cannot be null");
        }
        if (!stationRepository.existsById(stationId)) {
            throw new NotFoundException("Station not found with id: " + stationId);
        }
    }

    @Override
    public void validateStationName(String stationName) {
        if (stationName == null || stationName.trim().isEmpty()) {
            throw new StationValidationException("Station name cannot be null or empty");
        }
        if (stationName.length() < 2) {
            throw new StationValidationException("Station name must be at least 2 characters long");
        }
        if (stationName.length() > 100) {
            throw new StationValidationException("Station name cannot exceed 100 characters");
        }

        // Check for invalid characters (only allow letters, numbers, spaces, and basic
        // punctuation)
        if (!stationName.matches("^[a-zA-ZÀ-ỹĂăÂâÊêÔôƠơƯư0-9\\s.,'-]+$")) {
            throw new StationValidationException("Station name contains invalid characters");
        }
    }

    // Additional validation method to check for duplicate names during update
    public void validateStationNameForUpdate(String stationName, Long currentStationId) {
        if (stationName == null || stationName.trim().isEmpty()) {
            throw new StationValidationException("Station name cannot be null or empty");
        }
        if (stationName.length() < 2) {
            throw new StationValidationException("Station name must be at least 2 characters long");
        }
        if (stationName.length() > 100) {
            throw new StationValidationException("Station name cannot exceed 100 characters");
        }

        // Check for invalid characters
        if (!stationName.matches("^[a-zA-ZÀ-ỹĂăÂâÊêÔôƠơƯư0-9\\s.,'-]+$")) {
            throw new StationValidationException("Station name contains invalid characters");
        }

        // Check for duplicate station name (excluding current station during update)
        Optional<Station> existingStation = stationRepository.findByStationName(stationName.trim());
        if (existingStation.isPresent() && !existingStation.get().getStationId().equals(currentStationId)) {
            throw new StationValidationException("Station with this name already exists");
        }
    }

    @Override
    public void validateStationLocation(String stationLocation) {
        if (stationLocation == null || stationLocation.trim().isEmpty()) {
            throw new StationValidationException("Station location cannot be null or empty");
        }
        if (stationLocation.length() < 5) {
            throw new StationValidationException("Station location must be at least 5 characters long");
        }
        if (stationLocation.length() > 200) {
            throw new StationValidationException("Station location cannot exceed 200 characters");
        }

        // Check for valid location format (allow letters, numbers, spaces, and common
        // address characters)
        if (!stationLocation.matches("^[a-zA-ZÀ-ỹĂăÂâÊêÔôƠơƯư0-9\\s.,/'-]+$")) {
            throw new StationValidationException("Station location contains invalid characters");
        }
    }

    // Additional validation methods
    public void validateStationStatus(Status status) {
        if (status == null) {
            throw new StationValidationException("Station status cannot be null");
        }
    }

    public void validateStationDescription(String description) {
        if (description != null && description.length() > 500) {
            throw new StationValidationException("Station description cannot exceed 500 characters");
        }
    }

    public void validateImageFile(MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            // Check file size (max 5MB)
            if (image.getSize() > 5 * 1024 * 1024) {
                throw new StationValidationException("Image file size cannot exceed 5MB");
            }

            // Check file type
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new StationValidationException("Only image files are allowed");
            }

            // Check specific image types
            if (!contentType.equals("image/jpeg") &&
                    !contentType.equals("image/png") &&
                    !contentType.equals("image/gif") &&
                    !contentType.equals("image/webp")) {
                throw new StationValidationException("Only JPEG, PNG, GIF, and WebP images are allowed");
            }
        }
    }
}
