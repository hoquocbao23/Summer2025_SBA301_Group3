package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Account;
import com.sba301.metro_system.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findBookingByAccount_AccountId(Long accountAccountId);
}
