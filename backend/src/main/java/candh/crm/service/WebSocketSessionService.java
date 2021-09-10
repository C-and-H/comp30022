package candh.crm.service;

import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketSessionService
{
    private final Map<String, Principal> sessionMap = new HashMap<>();

    /**
     * Add a user to the session map.
     *
     * @param id  id of the user
     * @param principal
     */
    public void setUserSession(String id, Principal principal) {
        sessionMap.put(id, principal);
    }

    /**
     * Remove a user out of the session map.
     *
     * @param id  id of the user
     */
    public void removeSession(String id) {
        sessionMap.remove(id);
    }

    /**
     * Verify if a user is present in the session map.
     *
     * @param id  id of the user
     */
    public boolean sessionExists(String id) {
        return sessionMap.containsKey(id);
    }

    public Map<String, Principal> getSessionMap() {
        return sessionMap;
    }
}
