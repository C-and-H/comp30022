package candh.crm.service;

import candh.crm.model.Notification;
import candh.crm.model.User;
import candh.crm.repository.NotificationRepository;
import candh.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private WebSocketSubscriptionService webSocketSubscriptionService;

    @Autowired
    private SimpMessagingTemplate template;

    /**
     * Create and add a new notification into database.
     *
     * @param id  id of the user
     * @param message  message content
     */
    private void create(String id, String message) {
        notificationRepository.save(
                new Notification(id, message, LocalDateTime.now().toString()));
    }

    /**
     * Create a friend request notification for the receiver,
     * and push to the receiver if possible.
     *
     * @param receiverId  id of the receiver
     * @param senderId  id of the sender
     */
    public void createReceiveFriendRequestNotification(
            String receiverId, String senderId) {
        String senderName = userRepository.findById(senderId).get().getName();
        create(receiverId, "Friend request: " + senderName + ".");
        pushTo(receiverId);
    }

    /**
     * Delete the most recent sent friend request notification,
     * and push to the receiver if possible.
     *
     * @param receiverId  id of the receiver
     * @param senderId  id of the sender
     */
    public void deleteReceiveFriendRequestNotification(
            String receiverId, String senderId) {
        String senderName = userRepository.findById(senderId).get().getName();
        String message = "Friend request: " + senderName + ".";
        List<Notification> sent = notificationRepository.findByUserIdAndMessage(receiverId, message);
        if (!sent.isEmpty())
        {
            notificationRepository.delete(sent.stream()
                    .max(new Comparator<Notification>() {
                        @Override
                        public int compare(Notification o1, Notification o2) {
                            LocalDateTime t1 = LocalDateTime.parse(o1.getWhen());
                            LocalDateTime t2 = LocalDateTime.parse(o2.getWhen());
                            if (t1.isBefore(t2)) return -1;
                            else if (t1.isAfter(t2)) return 1;
                            else return 0;
                        }
                    }).get()
            );
            pushTo(receiverId);
        }
    }

    /**
     * Create a friend acceptance notification for the sender,
     * and push to the sender if possible.
     *
     * @param acceptorId  id of the confirmer
     * @param senderId  id of the sender
     */
    public void createAcceptFriendRequestNotification(
            String acceptorId, String senderId) {
        String acceptor = userRepository.findById(acceptorId).get().getName();
        create(senderId, "New friend: " + acceptor + "!");
        pushTo(senderId);
    }

    /**
     * Count the number of (unread) notifications given user id.
     * @return  {"count": number of notifications}, or null
     */
    public Map<String, Object> count(String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return new ConcurrentHashMap<String, Object>() {{
                put("count", notificationRepository.findByUserId(id).size());
            }};
        }
        return null;
    }

    /**
     * Actively push the number of (unread) notifications,
     * as long as the channel to a receiver is open, using socket.
     *
     * @param userId  id of the user
     */
    public void pushTo(String userId)
    {
        Map<String, List<String>> map =
                webSocketSubscriptionService.getNotificationMap();
        if (map.containsKey(userId)) {
            for (String path : map.get(userId)) {
                path = "/topic/notification/" + path;
                try {
                    template.convertAndSend(path, count(userId));
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
