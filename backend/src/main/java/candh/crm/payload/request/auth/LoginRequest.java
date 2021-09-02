package candh.crm.payload.request.auth;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /login.
 */
public class LoginRequest
{
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
