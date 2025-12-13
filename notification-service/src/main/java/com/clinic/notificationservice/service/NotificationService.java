package com.clinic.notificationservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.clinic.notificationservice.model.Notification;

@Service
public class NotificationService {

    private static final Logger log =
            LoggerFactory.getLogger(NotificationService.class);

    public void send(Notification notification) {
        log.info("Notification sent to {} : {}",
                notification.getRecipient(),
                notification.getMessage());
    }
}
