package candh.crm.service;

import candh.crm.model.Chat;
import candh.crm.model.Contact;
import candh.crm.model.User;
import candh.crm.payload.response.ChatOverviewResponse;
import candh.crm.repository.ChatRepository;
import candh.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ChatService
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ContactRelationService contactRelationService;

    @Autowired
    private WebSocketSubscriptionService webSocketSubscriptionService;

    @Autowired
    private SimpMessagingTemplate template;

    /**
     * Create an overview of chat between a user and all the friends.
     * Use descending sorting based on time.
     * Return includes null field if there's no chat between the pair.
     *
     * @param userId  id of the user
     */
    public List<ChatOverviewResponse> overview(String userId)
    {
        List<String> friendIds =
                contactRelationService.findAllFriends(userId).stream()
                        .map(Contact::getFriendId)
                        .collect(Collectors.toList());
        return friendIds.parallelStream()
                .map(f -> createOverview(userId, f))
                .sorted((o1, o2) -> {
                    Date t1 = o1.getTime(), t2 = o2.getTime();
                    if (t1 == null && t2 != null) return 1;
                    else if (t1 != null && t2 == null) return -1;
                    else if (t1 == null && t2 == null) return 0;
                    else if (t1.before(t2)) return 1;
                    else if (t1.after(t2)) return -1;
                    else return 0;
                })
                .collect(Collectors.toList());
    }

    private ChatOverviewResponse createOverview(String userId, String friendId)
    {
        List<Chat> latest =
                chatRepository.findNUntilT(userId, friendId, new Date(), 1);
        Long count = chatRepository.countUnread(friendId, userId);
        User friend = userRepository.findById(friendId).get();
        return new ChatOverviewResponse(
                friendId,
                friend.getName(),
                latest.isEmpty() ? null : latest.get(0).getMessage(),
                latest.isEmpty() ? null : latest.get(0).getWhen(),
                friend.getIcon(),
                count != null ? count : 0);
    }

    /**
     * Actively push senders' first names (of new messages) to receiver,
     * as long as the channel to the receiver is open, using socket.
     *
     * @param receiverId  id of the message receiver
     * @param senders  list of first names of message senders
     */
    public void pushTo(String receiverId, Collection<String> senders)
    {
        Map<String, List<String>> map = webSocketSubscriptionService.getPathMap();
        if (map.containsKey(receiverId))
        {
            // mark as pushed
            List<Chat> unnotified = chatRepository.findUnnotified(receiverId);
            for (Chat c : unnotified) c.setNotified(true);
            chatRepository.saveAll(unnotified);
            // push
            for (String path : map.get(receiverId)) {
                Thread pushSocket = new Thread(() -> {
                    try {
                        template.convertAndSend("/topic/chat/" + path,
                                new ConcurrentHashMap<String, Object>() {{
                                    put("from", senders);
                        }});
                    } catch (MessagingException e) {
                        e.printStackTrace();
                    }
                });
                pushSocket.start();
            }
        }
    }
}
