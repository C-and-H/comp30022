package candh.crm.controller;

import candh.crm.model.Notification;
import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.payload.request.auth.UnsubscribeRequest;
import candh.crm.repository.NotificationRepository;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import candh.crm.service.NotificationService;
import candh.crm.service.WebSocketSubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
     */
    @MessageMapping("/notification/unread")
    public void count(@Valid ByIdRequest byIdRequest)
    {
        String id = byIdRequest.getId();
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            notificationService.pushTo(id);
        }
    }

    /**
     * Handles Http Get for random notification subscription path allocation
     * for the new connection of socket clients.
     */
    @GetMapping("/notification/register")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> register(
            @RequestHeader("Authorization") String headerAuth)
    {
        String id = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        return ResponseEntity.ok(
                webSocketSubscriptionService.createPath(id));
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
        String id = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        // fetch
        List<Notification> notifications = notificationRepository.findByUserId(id);
        // delete
        Thread deleteFetched = new Thread(() -> {
            notificationRepository.deleteAll(notifications);
            notificationService.pushTo(id);
        });
        deleteFetched.start();

        return ResponseEntity.ok(notifications);
    }

    /**
     * Handles Http Post for subscription removal when a user logs out.
     */
    @PostMapping("/unsubscribe")
    @PreAuthorize("hasRole('USER')")
    public void unsubscribe(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody UnsubscribeRequest unsubscribeRequest)
    {
        String id = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        webSocketSubscriptionService.removePath(id,
                unsubscribeRequest.getNotificationPath());
    }
}
