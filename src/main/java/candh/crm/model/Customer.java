package candh.crm.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection="customer")
public class Customer
{
    @Id
    private String id;
    private String email;
    private String name;
    private String password;

    public String getName() { return this.name; }
}
