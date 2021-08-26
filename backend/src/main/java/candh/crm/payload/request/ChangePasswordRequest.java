package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request form body parameters for /changePassword.
 */
public class ChangePasswordRequest
{
    @NotBlank
    private String email;
    @NotBlank
    private String oldPassword;
    @NotBlank
    private String newPassword;
}
