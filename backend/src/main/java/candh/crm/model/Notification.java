package candh.crm.model;

import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Timestamp;

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
    Timestamp when;

    public Notification(String userId, String message, Timestamp when) {
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

    public Timestamp getWhen() {
        return when;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setWhen(Timestamp when) {
        this.when = when;
    }
}
