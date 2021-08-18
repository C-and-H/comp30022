package candh.crm.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Getter
@Setter
@ToString

@Document(collection = "user")
public class User
{
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;
    private String password;
    private String first_name;
    private String last_name;

    public User() {
    }

    public User(String email, String password, String first_name, String last_name) {
        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
    }

    public String getName() {
        return first_name + " " + last_name;
    }
}
