package candh.crm.model;

import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@ToString

@Document(collection = "notification")
public class Notification
{
    @Id
    String id;
    String userId;
    /** message content */
    String message;
    /** when the notification was created */
    String when;

    public Notification(String userId, String message, String when) {
        this.userId = userId;
        this.message = message;
        this.when = when;
    }

    public String getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }

    public String getWhen() {
        return when;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setWhen(String when) {
        this.when = when;
    }
}
