package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /user/deleteMobile.
 */
public class DeleteMobileRequest
{
    @NotBlank
    private String id;
    @NotBlank
    private String mobileCountryCode;
    @NotBlank
    private String mobileNumber;
}
