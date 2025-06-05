package com.sba301.metro_system.entity;

import com.sba301.metro_system.enums.Status;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "voucher")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voucherId;

    private String voucherName;
    private String voucherCode;
    private BigDecimal voucherDiscount;
    private LocalDateTime from;
    private LocalDateTime to;
    
    @Enumerated(EnumType.STRING)
    private Status status;
}
