package candh.crm.controller;

import candh.crm.model.Chat;
import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.payload.request.chat.FetchRequest;
import candh.crm.payload.request.chat.SendTextRequest;
import candh.crm.payload.response.ChatOverviewResponse;
import candh.crm.repository.ChatRepository;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import candh.crm.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("${crm.app.frontend.host}")
public class ChatController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ChatService chatService;

    @Autowired
    private JwtUtils jwtUtils;

    /** the number of messages to fetch once */
    public static final int N_FETCH = 10;

    /**
     * Responds with senders' first names (of new messages) using socket.
     * If receiverId not valid, don't send.
     *
     * @param byIdRequest  contains the receiver id
     */
    @MessageMapping("/chat/unread")
    public void from(@Valid ByIdRequest byIdRequest)
    {
        String receiverId = byIdRequest.getId();
        Optional<User> receiver = userRepository.findById(receiverId);
        if (receiver.isPresent()) {
            chatService.pushTo(receiverId,
                    chatRepository.findSendersOfUnread(receiverId).stream()
                            .map(User::getFirst_name).collect(Collectors.toList()));
        }
    }

    /**
     * Handles Http Post for sending a chat message.
     */
    @PostMapping("/chat/sendText")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendText(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody SendTextRequest sendTextRequest)
    {
        User sender = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        String receiverId = sendTextRequest.getId();
        Optional<User> receiver = userRepository.findById(receiverId);
        if (!receiver.isPresent()) {
            return ResponseEntity.ok("Receiver id not found.");
        }
        chatRepository.save(new Chat(sender.getId(), receiverId,
                sendTextRequest.getMessage()));
        chatService.pushTo(receiverId,
                Collections.singletonList(sender.getFirst_name()));
        return ResponseEntity.ok("Message Sent.");
    }

    /**
     * Handles Http Post for fetching an overview of incoming messages,
     * Use descending sorting based on time.
     */
    @GetMapping("/chat/overview")
    @PreAuthorize("hasRole('USER')")
    public List<ChatOverviewResponse> overview(
            @RequestHeader("Authorization") String headerAuth)
    {
        String id = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        return chatService.overview(id);
    }

    /**
     * Handles Http Post for fetching a specified number of messages
     * between a pair of sender and receiver, earlier than a specific time.
     * Use descending sorting based on time.
     *
     * Then marks all receiving messages as read.
     */
    @PostMapping("/chat/fetch")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> fetch(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody FetchRequest fetchRequest)
    {
        String senderId = fetchRequest.getId();
        String receiverId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        if (!userRepository.findById(senderId).isPresent()) {
            return ResponseEntity.ok("Sender id not found.");
        }

        Date until;
        try {
            until = new SimpleDateFormat("YYYY-MM-DD HH:mm:ss")
                    .parse(fetchRequest.getUntil());
        } catch (ParseException e) {
            e.printStackTrace();
            return ResponseEntity.ok("Invalid time format.");
        }

        List<Chat> to_fetch = chatRepository.findNUntilT(
                senderId, receiverId, until, N_FETCH);
        // mark
        List<Chat> chats = chatRepository.findUnread(senderId, receiverId);
        for (Chat c: chats) c.setUnread(false);
        chatRepository.saveAll(chats);

        return ResponseEntity.ok(to_fetch);
    }

    /**
     * Handles Http Post for a user marking the most recent incoming message
     * received from another user, as unread.
     *
     * @param byIdRequest  contains id of the person whose message we mark
     */
    @PostMapping("/chat/markAsUnread")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> markAsUnread(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        String senderId = byIdRequest.getId();
        String receiverId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        if (!userRepository.findById(senderId).isPresent()) {
            return ResponseEntity.ok("Sender id not found.");
        }
        Chat latest = chatRepository.findLatest(senderId, receiverId);
        if (latest != null) {
            latest.setUnread(true);
            chatRepository.save(latest);
            return ResponseEntity.ok("Marking completed.");
        }
        else {
            return ResponseEntity.ok("No chat found.");
        }
    }
}
