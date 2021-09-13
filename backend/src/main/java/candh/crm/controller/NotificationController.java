package candh.crm.controller;

import candh.crm.model.Notification;
import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.repository.NotificationRepository;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import candh.crm.service.NotificationService;
import candh.crm.service.WebSocketSubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("${crm.app.frontend.host}")
public class NotificationController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private WebSocketSubscriptionService webSocketSubscriptionService;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Responds with the number of (unread) notifications using socket.
     * If userId not valid, don't send.
     *
     * @param byIdRequest  contains the user id
     * @return  {"count": number of notifications}.
     */
    @MessageMapping("/notification/unread")
    public void count(@Valid ByIdRequest byIdRequest)
    {
        String userId = byIdRequest.getId();
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            notificationService.pushTo(userId);
        }
    }

    /**
     * Handles Http Get for random notification subscription path allocation
     * for the new connection of socket clients.
     */
    @GetMapping("/notification/connect")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> connect(
            @RequestHeader("Authorization") String headerAuth)
    {
        String id = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        return ResponseEntity.ok(
                webSocketSubscriptionService.createNotificationPath(id));
    }

    /**
     * Handles Http Get for fetching notifications,
     * and then delete them in database (once they are fetched).
     */
    @GetMapping("/notification/fetch")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> fetch(
            @RequestHeader("Authorization") String headerAuth)
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        // operate
        List<Notification> notifications = notificationRepository
                .findByUserId(userId);
        notificationRepository.deleteAll(notifications);
        // push through socket
        notificationService.pushTo(userId);
        return ResponseEntity.ok(notifications);
    }
}
