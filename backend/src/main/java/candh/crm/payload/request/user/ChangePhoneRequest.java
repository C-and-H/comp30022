package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /user/changePhone.
 */
public class ChangePhoneRequest
{
    @NotBlank
    private String id;
    private String mobileNumber;
}
