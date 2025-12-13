package com.clinic.notificationservice.controller;

import org.springframework.web.bind.annotation.*;

import com.clinic.notificationservice.model.Notification;
import com.clinic.notificationservice.service.NotificationService;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public void sendNotification(@RequestBody Notification notification) {
        service.send(notification);
    }
}
