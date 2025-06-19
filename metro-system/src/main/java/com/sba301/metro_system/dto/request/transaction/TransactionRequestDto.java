package com.sba301.metro_system.dto.request.transaction;

import com.sba301.metro_system.entity.Account;
import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.enums.PaymentMethod;
import com.sba301.metro_system.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionRequestDto {
    private long ticketId;
    private PaymentMethod paymentMethod;
    private TransactionStatus transactionStatus;

}
