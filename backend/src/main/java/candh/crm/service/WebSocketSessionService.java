package candh.crm.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WebSocketSessionService
{
    private final Map<String, String> sessionMap = new ConcurrentHashMap<>();

    /**
     * Add a user to the session map.
     *
     * @param userId  id of the user
     * @param sessionId  id of the session
     */
    public void setUserSession(String userId, String sessionId) {
        sessionMap.put(userId, sessionId);
    }

    /**
     * Remove a user out of the session map.
     *
     * @param sessionId  id of the session
     */
    public void removeSession(String sessionId) {
        sessionMap.values().remove(sessionId);
    }

    public Map<String, String> getSessionMap() {
        return sessionMap;
    }
}
