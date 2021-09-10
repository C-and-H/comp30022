package candh.crm.config;

import candh.crm.service.WebSocketSessionService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpAttributesContextHolder;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

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
        String userId = nativeHeaders.get("id").get(0);
        String sessionId = SimpAttributesContextHolder.currentAttributes().getSessionId();
        webSocketSessionService.setUserSession(userId, sessionId);
    }

    @EventListener
    private void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor stompAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = SimpAttributesContextHolder.currentAttributes().getSessionId();
        webSocketSessionService.removeSession(sessionId);
    }
}
