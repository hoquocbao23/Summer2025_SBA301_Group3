package com.sba301.metro_system.service;

import com.sba301.metro_system.record.MailBody;

public interface IEmailService {
    public void sendOTP(MailBody body);
}
