package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {

    Optional<Train> findByTrainName(String trainName);

    boolean existsByTrainName(String trainName);

    @Query("SELECT t FROM Train t WHERE LOWER(t.trainName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Train> findByTrainNameContaining(@Param("keyword") String keyword);

    List<Train> findByTrainModel(String trainModel);

    List<Train> findByTrainManufacturer(String trainManufacturer);
}
