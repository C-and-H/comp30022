package candh.crm.model;

import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.util.Objects;

@ToString

@Document(collection = "contactRelation")
public class Contact
{
    @Id
    private String id;

    private String userId;
    private String friendId;
    private boolean accepted;
    private String notes;

    public Contact(String userId, String friendId) {
        this.userId = userId;
        this.friendId = friendId;
        // TODO: friend confirmation
        this.accepted = true;
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

    public String getNotes() {
        return notes;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
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
