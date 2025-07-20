package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.response.train.TrainResponseDTO;
import com.sba301.metro_system.entity.Train;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TrainMapper {
    TrainMapper INSTANCE = Mappers.getMapper(TrainMapper.class);

    @Mapping(source = "route.routeId", target = "routeId")
    TrainResponseDTO toResponseDto(Train train);

    List<TrainResponseDTO> toResponseDtoList(List<Train> trains);
}
