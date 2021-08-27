package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /user/addMobile.
 */
public class AddMobileRequest
{
    @NotBlank
    private String id;
    @NotBlank
    private String mobileCountryCode;
    @NotBlank
    private String mobileNumber;
}
