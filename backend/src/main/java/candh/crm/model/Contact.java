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

    private String userEmail;
    private String friendEmail;
    private boolean accepted;
    private String notes;

    public Contact(String userEmail, String friendEmail) {
        this.userEmail = userEmail;
        this.friendEmail = friendEmail;
        // TODO: friend confirmation
        this.accepted = false;
        this.notes = "";
    }
}
