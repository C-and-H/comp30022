package candh.crm.service;

import lombok.Getter;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Getter

@Service
public class WebSocketSubscriptionService
{
    private final Map<String, List<String>> chatMap = new ConcurrentHashMap<>();
    private final Map<String, List<String>> notificationMap = new ConcurrentHashMap<>();

    // the maximal number of subscription paths of a client
    public static final int MAX_N_PATH = 3;

    // for random string generator
    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String DATA_FOR_RANDOM_STRING = CHAR_LOWER + CHAR_UPPER + NUMBER;
    private static SecureRandom random = new SecureRandom();   // alphanumeric string of length 20-30

    /**
     * Remove a subscription from map provided with user id.
     *
     * @param id  id of the user
     * @param path  the notification subscription path
     */
    public void removeNotificationPath(String id, String path) {
        if (notificationMap.containsKey(id)) {
            notificationMap.get(id).remove(path);
        }
    }

    /**
     * Create a new random notification subscription path for a user,
     * and then update the map.
     *
     * @param id  id of a user
     * @return  the generated path
     */
    public String createNotificationPath(String id) {
        String toAdd = generateRandomString(random.nextInt(11)+20);
        if (notificationMap.containsKey(id)) {
            List<String> paths = notificationMap.get(id);
            if (paths.size() == MAX_N_PATH) paths.remove(0);   // remove the oldest
            paths.add(toAdd);
        } else {
            notificationMap.put(id, new ArrayList<>(Collections.singletonList(toAdd)));
        }
        return toAdd;
    }

    private static String generateRandomString(int length) {
        if (length < 1) throw new IllegalArgumentException();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int rndCharAt = random.nextInt(DATA_FOR_RANDOM_STRING.length());
            sb.append(DATA_FOR_RANDOM_STRING.charAt(rndCharAt));
        }
        return sb.toString();
    }
}
