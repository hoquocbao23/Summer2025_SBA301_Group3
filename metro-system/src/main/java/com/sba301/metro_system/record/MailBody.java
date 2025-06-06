package com.sba301.metro_system.record;

import lombok.Builder;

@Builder
public record MailBody(String to, String subject, String text) {
}