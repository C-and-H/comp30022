package candh.crm.model;

import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.util.Objects;

@ToString

/**
 * Overall, 7 different scenarios:
 *
 * - 1: user_accepted = T, user_ignored = F, friend_accepted = T, friend_ignored = F => friends
 * - 2: ua = T, ui = F, fa = F, fi = F => user sent request but not yet responded
 * - 3: ua = F, ui = F, fa = T, fi = F => user received request but not yet responded
 * - 4: ua = F, ui = T, fa = T, fi = F => user received request and declined
 * - 5: ua = T, ui = F, fa = F, fi = T => user sent request and was declined
 * - 6: ua = F, ui = F, fa = F, fi = F => one of user and friend sent request and cancelled
 * - 7: u = null, f = null => user and friend has never sent request to each other
 */
@Document(collection = "contactRelation")
public class Contact
{
    @Id
    private String id;
    private String userId;
    private String friendId;

    /** user accepts friend */
    private boolean accepted;
    /** user declines and hides the received friend request */
    private boolean ignored;

    private String notes;

    public Contact() { }

    public Contact(String userId, String friendId, boolean accepted) {
        this.userId = userId;
        this.friendId = friendId;
        this.accepted = accepted;
        this.ignored = false;
        this.notes = "";
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getFriendId() {
        return friendId;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public boolean isIgnored() {
        return ignored;
    }

    public String getNotes() {
        return notes;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public void setIgnored(boolean ignored) {
        this.ignored = ignored;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Contact contact = (Contact) obj;
        return Objects.equals(id, contact.id);
    }
}
