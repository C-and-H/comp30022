package candh.crm.service;

import candh.crm.model.Chat;
import candh.crm.model.Contact;
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
        return friendIds.stream()
                // create
                .map(f -> createOverview(userId, f))
                // sort
                .sorted(new Comparator<ChatOverviewResponse>() {
                    @Override
                    public int compare(ChatOverviewResponse o1, ChatOverviewResponse o2) {
                        Date t1 = o1.getTime(), t2 = o2.getTime();
                        if (t1 == null && t2 != null) return 1;
                        else if (t1 != null && t2 == null) return -1;
                        else if (t1 == null && t2 == null) return 0;
                        else if (t1.before(t2)) return 1;
                        else if (t1.after(t2)) return -1;
                        else return 0;
                    }
                })
                .collect(Collectors.toList());
    }

    private ChatOverviewResponse createOverview(String userId, String friendId)
    {
        List<Chat> latest =
                chatRepository.findNUntilT(userId, friendId, new Date(), 1);
        Long count = chatRepository.countUnread(friendId, userId);
        return new ChatOverviewResponse(
                friendId,
                userRepository.findById(friendId).get().getName(),
                latest.isEmpty() ? null : latest.get(0).getMessage(),
                latest.isEmpty() ? null : latest.get(0).getWhen(),
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
        if (map.containsKey(receiverId)) {
            for (String path : map.get(receiverId)) {
                path = "/topic/chat/" + path;
                try {
                    template.convertAndSend(path,
                            new ConcurrentHashMap<String, Object>() {{
                                put("from", senders);
                            }});
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
