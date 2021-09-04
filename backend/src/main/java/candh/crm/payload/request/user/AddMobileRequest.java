package candh.crm.payload.request.user;

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

    public String getMobileNumber() {
        return this.mobileNumber;
    }

    public String getMobileCountryCode() {
        return this.mobileCountryCode;
    }

    public String getId() {
        return this.id;
    }
}
