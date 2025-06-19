package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.transaction.TransactionRequestDto;
import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.entity.Transaction;

public interface ITransactionService {
    void saveTransaction(TransactionRequestDto transaction, Ticket ticket);
}
