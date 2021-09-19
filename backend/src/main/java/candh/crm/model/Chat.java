package candh.crm.model;

import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@ToString

@Document(collection = "chatHistory")
public class Chat
{
    @Id
    private String id;
    private String senderId;
    private String receiverId;
    /** message content */
    private String message;
    /** when the message was sent */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    @CreatedDate
    private Date when;
    /** whether message is unread */
    private boolean unread;

    public Chat() { }

    public Chat(String senderId, String receiverId, String message, Date when) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.when = when;
        this.unread = true;
    }

    public String getSenderId() {
        return senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public String getMessage() {
        return message;
    }

    public Date getWhen() {
        return when;
    }

    public boolean isUnread() {
        return unread;
    }

    public void setUnread(boolean unread) {
        this.unread = unread;
    }
}
