package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Account, Long> {
    public Account findByEmail(String email);
}
