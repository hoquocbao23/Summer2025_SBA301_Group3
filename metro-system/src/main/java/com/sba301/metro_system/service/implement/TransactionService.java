package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.transaction.TransactionRequestDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.entity.Transaction;
import com.sba301.metro_system.enums.TransactionStatus;
import com.sba301.metro_system.repository.TicketRepository;
import com.sba301.metro_system.repository.TransactionRepository;
import com.sba301.metro_system.service.ITransactionService;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final TransactionRepository transactionRepository;
    private final TicketRepository ticketRepository;


    @Override
    @Transactional
    public void saveTransaction(TransactionRequestDto transactionDto, Ticket ticket) {
        Transaction transaction = new Transaction();
        transaction.setAmount(ticket.getNewPrice());
        transaction.setPaymentMethod(transactionDto.getPaymentMethod());
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setStatus(transactionDto.getTransactionStatus());
        transaction.setTicket(ticket);
        transaction.setAccount(ticket.getAccount());
        transaction.setPayOrderId(transactionDto.getPayOrderId());
        transaction.setCounterAccountNumber(transactionDto.getCounterAccountNumber());
        transaction.setCounterAccountName(transactionDto.getCounterAccountName());
        transaction.setCounterAccountBankId(transactionDto.getCounterAccountBankId());
        transactionRepository.save(transaction);
    }
}
