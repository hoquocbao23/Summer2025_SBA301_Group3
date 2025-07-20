package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.train.TrainRequestDTO;
import com.sba301.metro_system.dto.response.train.TrainResponseDTO;
import com.sba301.metro_system.entity.Route;
import com.sba301.metro_system.service.ITrainService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trains")
@RequiredArgsConstructor
@Tag(name = "Train Management", description = "APIs for managing trains")
@SecurityRequirement(name = "bearerAuth")
public class TrainController {

    @Autowired
    private ITrainService trainService;

    @GetMapping
    @Operation(summary = "Get all trains", description = "Retrieve all trains in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Trains retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "No trains found")
    })
    public ResponseApi<List<TrainResponseDTO>> getAllTrains() {
        try {
            List<TrainResponseDTO> trains = trainService.findAll();
            return ResponseApi.<List<TrainResponseDTO>>builder()
                    .status(HttpStatus.OK.value())
                    .message("Trains retrieved successfully")
                    .data(trains)
                    .build();
        } catch (Exception e) {
            return ResponseApi.<List<TrainResponseDTO>>builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message(e.getMessage())
                    .build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get train by ID", description = "Retrieve a specific train by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Train retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Train not found")
    })
    public ResponseApi<TrainResponseDTO> getTrainById(
            @Parameter(description = "Train ID", required = true) @PathVariable Long id) {
        try {
            TrainResponseDTO train = trainService.findById(id);
            return ResponseApi.<TrainResponseDTO>builder()
                    .status(HttpStatus.OK.value())
                    .message("Train retrieved successfully")
                    .data(train)
                    .build();
        } catch (Exception e) {
            return ResponseApi.<TrainResponseDTO>builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message(e.getMessage())
                    .build();
        }
    }

    @PostMapping
    @Operation(summary = "Create train", description = "Create a new train (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Train created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin access required")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseApi<TrainResponseDTO> createTrain(
            @Parameter(description = "Train data", required = true) @Valid @RequestBody TrainRequestDTO trainRequestDTO) {
        try {
            TrainResponseDTO createdTrain = trainService.save(trainRequestDTO);
            return ResponseApi.<TrainResponseDTO>builder()
                    .status(HttpStatus.CREATED.value())
                    .message("Train created successfully")
                    .data(createdTrain)
                    .build();
        } catch (Exception e) {
            return ResponseApi.<TrainResponseDTO>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update train", description = "Update an existing train (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Train updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin access required"),
            @ApiResponse(responseCode = "404", description = "Train not found")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseApi<TrainResponseDTO> updateTrain(
            @Parameter(description = "Train ID", required = true) @PathVariable Long id,
            @Parameter(description = "Updated train data", required = true) @Valid @RequestBody TrainRequestDTO trainRequestDTO,
            @Parameter Long idRoute
    ) {
        try {
            TrainResponseDTO updatedTrain = trainService.update(id, trainRequestDTO,idRoute);
            return ResponseApi.<TrainResponseDTO>builder()
                    .status(HttpStatus.OK.value())
                    .message("Train updated successfully")
                    .data(updatedTrain)
                    .build();
        } catch (Exception e) {
            return ResponseApi.<TrainResponseDTO>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete train", description = "Delete a train (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Train deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin access required"),
            @ApiResponse(responseCode = "404", description = "Train not found")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseApi<String> deleteTrain(
            @Parameter(description = "Train ID", required = true) @PathVariable Long id) {
        try {
            trainService.delete(id);
            return ResponseApi.<String>builder()
                    .status(HttpStatus.NO_CONTENT.value())
                    .message("Train deleted successfully")
                    .data("Train with ID " + id + " has been deleted")
                    .build();
        } catch (Exception e) {
            return ResponseApi.<String>builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message(e.getMessage())
                    .build();
        }
    }
}
