package candh.crm.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Getter
@Setter
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
        this.accepted = false;
        this.notes = "";
    }
}
