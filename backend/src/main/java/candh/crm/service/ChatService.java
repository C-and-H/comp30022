package candh.crm.service;

import candh.crm.model.Chat;
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
    private WebSocketSubscriptionService webSocketSubscriptionService;

    @Autowired
    private SimpMessagingTemplate template;

    /**
     * Create an overview of incoming messages.
     * Use descending sorting based on time.
     *
     * @param id  id of the user
     */
    public List<ChatOverviewResponse> overview(String id)
    {
        return chatRepository.findEachLatestById(id).stream()
                .map(c -> createOverview(c, id))
                .sorted(new Comparator<ChatOverviewResponse>() {
                    @Override
                    public int compare(ChatOverviewResponse o1, ChatOverviewResponse o2) {
                        if (o1.getTime().before(o2.getTime())) return -1;
                        else if (o1.getTime().after(o2.getTime())) return 1;
                        else return 0;
                    }
                })
                .collect(Collectors.toList());
    }

    private ChatOverviewResponse createOverview(Chat c, String userId) {
        String friendId = c.getSenderId();
        if (c.getSenderId().equals(userId)) friendId = c.getReceiverId();
        return new ChatOverviewResponse(friendId,
                userRepository.findById(friendId).get().getName(),
                c.getMessage(),
                c.getWhen(),
                chatRepository.countUnread(friendId, userId));
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
