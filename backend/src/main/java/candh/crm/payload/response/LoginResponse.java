package candh.crm.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

/**
 * Response body parameters for /login.
 */
public class LoginResponse
{
    private String token;
    private String type = "Bearer";
    private String id;
    private String email;

    public LoginResponse(String accessToken, String id, String email) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
    }
}
