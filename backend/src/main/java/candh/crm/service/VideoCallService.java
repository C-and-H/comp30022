package candh.crm.service;

import candh.crm.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VideoCallService
{

    @Autowired
    private WebSocketSubscriptionService webSocketSubscriptionService;

    @Autowired
    private SimpMessagingTemplate template;

    public void call(String receiverId, User sender, String signal)
    {
        Map<String, List<String>> map = webSocketSubscriptionService.getPathMap();
        if (map.containsKey(receiverId)) {
            for (String path : map.get(receiverId)) {
                path = "/topic/othersCallingYou/" + path;
                try {
                    template.convertAndSend(path,
                            new ConcurrentHashMap<String, Object>() {{
                                put("from", sender.getId());
                                put("name", sender.getName());
                                put("signal", signal);
                            }});
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void answer(String receiverId, User sender, String signal)
    {
        Map<String, List<String>> map = webSocketSubscriptionService.getPathMap();
        if (map.containsKey(receiverId)) {
            for (String path : map.get(receiverId)) {
                path = "/topic/othersAnswering/" + path;
                try {
                    template.convertAndSend(path,
                            new ConcurrentHashMap<String, Object>() {{
                                //put("from", sender.getId());
                                put("name", sender.getName());
                                put("signal", signal);
                            }});
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void reject(String receiverId, User sender)
    {
        Map<String, List<String>> map = webSocketSubscriptionService.getPathMap();
        if (map.containsKey(receiverId)) {
            for (String path : map.get(receiverId)) {
                path = "/topic/othersReject/" + path;
                try {
                    template.convertAndSend(path,
                            new ConcurrentHashMap<String, Object>() {{
                                put("from", sender.getId());
                            }});
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void end(String receiverId, User sender)
    {
        Map<String, List<String>> map = webSocketSubscriptionService.getPathMap();
        if (map.containsKey(receiverId)) {
            for (String path : map.get(receiverId)) {
                path = "/topic/othersEnding/" + path;
                try {
                    template.convertAndSend(path,
                            new ConcurrentHashMap<String, Object>() {{
                                put("from", sender.getId());
                            }});
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
