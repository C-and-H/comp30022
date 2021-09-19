package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.payload.request.chat.FetchReadRequest;
import candh.crm.repository.ChatRepository;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@CrossOrigin("${crm.app.frontend.host}")
public class ChatController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private JwtUtils jwtUtils;

    /** the number of read messages to fetch once */
    public static final int N_FETCHREAD = 20;

    /**
     * Handles Http Get for all unread messages.
     */
    @GetMapping("/chat/fetchUnread")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> fetchUnread(
            @RequestHeader("Authorization") String headerAuth)
    {
        String id = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        return ResponseEntity.ok(
                chatRepository.findUnreadByReceiverId(id));
    }

    /**
     * Handles Http Post for fetching 20 old messages
     * between a pair of sender and receiver, earlier than a specific time.
     * Use descending sorting based on time.
     */
    @PostMapping("/chat/fetchRead")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> fetchRead(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody FetchReadRequest fetchReadRequest)
    {
        String senderId = fetchReadRequest.getId();
        String receiverId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        Optional<User> sender = userRepository.findById(senderId);
        if (!sender.isPresent()) {
            return ResponseEntity.ok("Sender id not found.");
        }
        return ResponseEntity.ok(
                chatRepository.findNReadBySenderAndReceiverIdFromT(
                senderId, receiverId, N_FETCHREAD, fetchReadRequest.getFrom()));
    }
}
