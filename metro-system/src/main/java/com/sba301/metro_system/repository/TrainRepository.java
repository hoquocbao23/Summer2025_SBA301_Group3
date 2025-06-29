package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainRepository extends JpaRepository<Train, Long> {
}
