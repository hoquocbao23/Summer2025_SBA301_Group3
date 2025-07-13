package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.request.transaction.TransactionRequestDto;
import com.sba301.metro_system.entity.Transaction;
import com.sba301.metro_system.enums.PaymentMethod;
import com.sba301.metro_system.enums.TransactionStatus;

public class TransactionMapper {
    public static TransactionRequestDto getTransactionRequestDto(long bookingId, PaymentMethod paymentMethod, TransactionStatus transactionStatus) {
        TransactionRequestDto transactionRequestDto = new TransactionRequestDto();
        transactionRequestDto.setBookingId(bookingId);
        transactionRequestDto.setPaymentMethod(paymentMethod);
        transactionRequestDto.setTransactionStatus(transactionStatus);
        return transactionRequestDto;
    }
}
