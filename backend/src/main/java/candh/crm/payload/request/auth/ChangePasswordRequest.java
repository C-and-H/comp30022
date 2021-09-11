package candh.crm.payload.request.auth;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /user/changePassword.
 */
public class ChangePasswordRequest
{
    @NotBlank
    private String oldPassword;
    @NotBlank
    private String newPassword;
}
