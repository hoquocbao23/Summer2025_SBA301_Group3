package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {

    Optional<Station> findByStationName(String stationName);

    List<Station> findByStatus(Status status);

    List<Station> findByStationLocationContainingIgnoreCase(String location);

    boolean existsByStationName(String stationName);

    @Query("SELECT s FROM Station s WHERE LOWER(s.stationName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Station> findByStationNameContaining(@Param("keyword") String keyword);
}
