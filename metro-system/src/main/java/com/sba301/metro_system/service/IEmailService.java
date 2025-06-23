package com.sba301.metro_system.service;

import com.sba301.metro_system.record.MailBody;
import org.springframework.ui.Model;

public interface IEmailService {
    public void sendOTP(MailBody body);
    void sendEmail(MailBody body, Model model);
}
