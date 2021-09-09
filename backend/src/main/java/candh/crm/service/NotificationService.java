package candh.crm.service;

import candh.crm.controller.NotificationController;
import candh.crm.model.Notification;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService
{
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationController notificationController;

    @Autowired
    private WebSocketSessionService webSocketSessionService;

    @Autowired
    private SimpMessagingTemplate template;

    /**
     * Create and add a new notification into database.
     *
     * @param id  id of the user
     * @param message  message content
     */
    public void create(String id, String message) {
        notificationRepository.save(
                new Notification(id, message, LocalDateTime.now().toString()));
    }

    /**
     * Actively push the map that contains the number of (unread) notifications,
     * as long as the channel to a receiver is open, using socket.
     *
     * @param id  id of the user
     */
    public void push(String id) {
        if (webSocketSessionService.sessionExists(id)) {
            template.convertAndSend(id, "/topic/notification",
                    notificationController.count(new ByIdRequest(id)));
        }
    }
}
