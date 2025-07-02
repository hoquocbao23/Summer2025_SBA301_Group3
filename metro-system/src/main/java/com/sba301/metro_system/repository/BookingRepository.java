package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
