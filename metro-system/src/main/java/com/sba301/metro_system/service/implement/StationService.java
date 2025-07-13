package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.station.StationDTO;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.entity.UserPrinciple;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.repository.StationRepository;
import com.sba301.metro_system.service.ICloudinaryService;
import com.sba301.metro_system.service.IStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
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
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null || "anonymousUser".equals(principal)) {
            return ResponseApi.builder()
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .message(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                    .data("UNAUTHORIZED")
                    .build();
        }

        // Tạo entity Station từ StationDTO
        Station station = new Station();
        station.setStationName(stationDTO.getStationName());
        station.setStationLocation(stationDTO.getStationLocation());
        station.setDescription(stationDTO.getDescription());
        station.setStatus(stationDTO.getStatus() != null ? stationDTO.getStatus() : Status.ACTIVE);

        // Xử lý upload hình ảnh lên Cloudinary nếu có
        MultipartFile image = stationDTO.getImage();
        if (image != null && !image.isEmpty()) {
            try {
                Map uploadResult = cloudinaryService.upload(image, "metro_stations");
                station.setImageUrl((String) uploadResult.get("secure_url"));
                station.setImagePublicId((String) uploadResult.get("public_id"));
            } catch (Exception e) {
                return ResponseApi.builder()
                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .message("Failed to upload image: " + e.getMessage())
                        .data(null)
                        .build();
            }
        }

        // Lưu station vào database
        try {
            Station savedStation = stationRepository.save(station);
            return ResponseApi.builder()
                    .status(HttpStatus.CREATED.value())
                    .message(HttpStatus.CREATED.getReasonPhrase())
                    .data(savedStation)
                    .build();
        } catch (Exception e) {
            return ResponseApi.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Failed to save station: " + e.getMessage())
                    .data(null)
                    .build();
        }
    }

    @Override
    public ResponseApi<?> updateStation(StationDTO stationDTO, Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null || "anonymousUser".equals(principal)) {
            return ResponseApi.builder()
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .message(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                    .data("UNAUTHORIZED")
                    .build();
        }

        Optional<Station> optionalStation = stationRepository.findById(id);
        if (optionalStation.isEmpty()) {
            return ResponseApi.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message(HttpStatus.NOT_FOUND.getReasonPhrase())
                    .data("Not found Station with id " + id)
                    .build();
        }

        Station station = optionalStation.get();
        station.setStationName(stationDTO.getStationName());
        station.setStationLocation(stationDTO.getStationLocation());
        station.setDescription(stationDTO.getDescription());
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
                Map uploadResult = cloudinaryService.upload(image, "metro_stations");
                station.setImageUrl((String) uploadResult.get("secure_url"));
                station.setImagePublicId((String) uploadResult.get("public_id"));
            } catch (Exception e) {
                return ResponseApi.builder()
                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .message("Failed to update image: " + e.getMessage())
                        .data(null)
                        .build();
            }
        }

        // Lưu thay đổi
        try {
            Station updatedStation = stationRepository.save(station);
            return ResponseApi.builder()
                    .status(HttpStatus.OK.value())
                    .message(HttpStatus.OK.getReasonPhrase())
                    .data(updatedStation)
                    .build();
        } catch (Exception e) {
            return ResponseApi.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Failed to update station: " + e.getMessage())
                    .data(null)
                    .build();
        }
    }

    @Override
    public ResponseApi<?> deleteStation(Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null || "anonymousUser".equals(principal)) {
            return ResponseApi.builder()
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .message(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                    .data("UNAUTHORIZED")
                    .build();
        }

        Optional<Station> optionalStation = stationRepository.findById(id);
        if (optionalStation.isEmpty()) {
            return ResponseApi.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message(HttpStatus.NOT_FOUND.getReasonPhrase())
                    .data("Not found Station with id " + id)
                    .build();
        }

        Station station = optionalStation.get();

        // Xóa hình ảnh trên Cloudinary nếu tồn tại
        if (station.getImagePublicId() != null) {
            try {
                cloudinaryService.delete(station.getImagePublicId());
            } catch (Exception e) {
                return ResponseApi.builder()
                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .message("Failed to delete image: " + e.getMessage())
                        .data(null)
                        .build();
            }
        }

        // Xóa cứng bản ghi
        try {
            stationRepository.delete(station);
            return ResponseApi.builder()
                    .status(HttpStatus.OK.value())
                    .message("Station deleted successfully")
                    .data(null)
                    .build();
        } catch (Exception e) {
            return ResponseApi.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to delete station: " + e.getMessage())
                    .data(null)
                    .build();
        }
    }
}
