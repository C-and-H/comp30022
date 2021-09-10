package candh.crm.controller;

import candh.crm.model.Notification;
import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.repository.NotificationRepository;
import candh.crm.repository.UserRepository;
import candh.crm.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@CrossOrigin("*")
public class NotificationController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Respond with the number of (unread) notifications using socket.
     * If userId not valid, send -1.
     *
     * @param byIdRequest  contains the user id
     * @return  {"count": number of notifications}
     */
    @MessageMapping("/notification/unread")
    @SendTo("/topic/notification")
    public Map<String, Object> count(@Valid ByIdRequest byIdRequest) {
        Optional<User> user = userRepository.findById(byIdRequest.getId());
        if (user.isPresent()) {
            return new ConcurrentHashMap<String, Object>() {{
                put("count", notificationRepository
                        .findByUserId(byIdRequest.getId()).size());
            }};
        } else {
            return new ConcurrentHashMap<String, Object>() {{
                put("count", -1);
            }};
        }
    }

    /**
     * Handles Http Post for fetching notifications,
     * and then delete them in database (once they are fetched).
     */
    @PostMapping("/notification/fetch")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> fetch(
            @Valid @RequestBody ByIdRequest byIdRequest) {
        Optional<User> user = userRepository.findById(byIdRequest.getId());
        if (user.isPresent()) {
            // operate
            List<Notification> notifications = notificationRepository
                    .findByUserId(byIdRequest.getId());
            notificationRepository.deleteAll(notifications);
            // push through socket
            notificationService.push(byIdRequest.getId());
            return ResponseEntity.ok(notifications);
        } else {
            return ResponseEntity.ok("User Id not found.");
        }
    }
}
