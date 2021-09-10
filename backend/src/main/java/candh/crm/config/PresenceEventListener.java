package candh.crm.config;

import candh.crm.service.WebSocketSessionService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.List;
import java.util.Map;

public class PresenceEventListener
{
    private final WebSocketSessionService webSocketSessionService;

    public PresenceEventListener(WebSocketSessionService webSocketSessionService) {
        this.webSocketSessionService = webSocketSessionService;
    }

    @EventListener
    private void handleSessionConnected(SessionConnectEvent event) {
        StompHeaderAccessor stompAccessor = StompHeaderAccessor.wrap(event.getMessage());
        @SuppressWarnings("unchecked")
        Map<String, List<String>> nativeHeaders = (Map<String, List<String>>)
                stompAccessor.getHeader("nativeHeaders");
        String id = nativeHeaders.get("id").get(0);
        Principal principal = event.getUser();
        webSocketSessionService.setUserSession(id, principal);
    }

    @EventListener
    private void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor stompAccessor = StompHeaderAccessor.wrap(event.getMessage());
        @SuppressWarnings("unchecked")
        Map<String, List<String>> nativeHeaders = (Map<String, List<String>>)
                stompAccessor.getHeader("nativeHeaders");
        String id = nativeHeaders.get("id").get(0);
        webSocketSessionService.removeSession(id);
    }
}
