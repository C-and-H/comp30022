package candh.crm.controller;

import candh.crm.model.Notification;
import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.payload.request.notification.FetchRequest;
import candh.crm.repository.NotificationRepository;
import candh.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class NotificationController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate template;

    /**
     * Actively push the number of (unread) notifications using socket.
     *
     * @param byIdRequest  contains the user id
     */
    public void pushNotification(@Valid ByIdRequest byIdRequest) {
        template.convertAndSend("/topic/notification",
                notification(byIdRequest));
    }

    /**
     * Respond with the number of (unread) notifications using socket.
     * If userId not valid, send -1.
     *
     * @param byIdRequest  contains the user id
     */
    @MessageMapping("/notification/unread")
    @SendTo("/topic/notification")
    public int notification(@Valid ByIdRequest byIdRequest) {
        Optional<User> user = userRepository.findById(byIdRequest.getId());
        if (user.isPresent()) {
            return notificationRepository.findByUserId(byIdRequest.getId()).size();
        } else {
            return -1;
        }
    }

    /**
     * Handles Http Post for fetching notifications,
     * and then delete them in database.
     */
    @PostMapping("/notification/fetch")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> fetch(
            @Valid @RequestBody FetchRequest fetchRequest) {
        Optional<User> user = userRepository.findById(fetchRequest.getUserId());
        if (user.isPresent()) {
            List<Notification> notifications = (List<Notification>)
                    notificationRepository.findAllById(fetchRequest.getNotificationIds());
            notificationRepository.deleteAll(notifications);
            pushNotification(new ByIdRequest(fetchRequest.getUserId()));
            return ResponseEntity.ok(notifications);
        } else {
            return ResponseEntity.ok("User Id not found.");
        }
    }
}
