package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.record.MailBody;
import com.sba301.metro_system.service.IEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${metro.forum.email.footer}")
    private String emailFooter;

    @Override
    public void sendOTP(MailBody mailBody) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(mailBody.to());
            helper.setSubject(mailBody.subject());
            helper.setText(buildEmailContent(mailBody.text()), true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new IllegalStateException("Failed to send email to " + mailBody.to() + ": " + e.getMessage());
        }
    }

    public String buildEmailContent(String text) {
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Metro SG Email</title>
            </head>
            <body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: linear-gradient(135deg, #ffffff, #f9f9f9); border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center; padding-bottom: 20px;">
                        <h2 style="color: #2c6e49; font-size: 24px; margin: 0; font-weight: 600;">Metro SG</h2>
                    </div>
                    <div style="font-size: 16px; line-height: 1.6; color: #444444; padding: 0 15px;">
                        %s
                    </div>
                    <hr style="border: 0; border-top: 1px solid #dddddd; margin: 20px 0;">
                    <div style="font-size: 12px; color: #777777; text-align: center; line-height: 1.4;">
                        %s
                    </div>
                </div>
            </body>
            </html>
            """.formatted(text, emailFooter));

        return emailContent.toString();
    }
}
