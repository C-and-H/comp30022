package candh.crm.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String username;
    private String email;
    private String first_name, last_name;
    private List<String> roles;

    public JwtResponse(String accessToken, String id, String username,
                       String email, String first_name, String last_name,
                       List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.first_name = first_name;
        this.last_name = last_name;
    }
}
