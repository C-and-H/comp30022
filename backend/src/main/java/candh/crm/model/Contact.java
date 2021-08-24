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

    private String user;
    private String friend;
    private boolean accepted;
    private String notes;

    public Contact(String user, String friend) {
        this.user = user;
        this.friend = friend;
        // TODO: friend confirmation
        this.accepted = true;
        this.notes = "";
    }
}
