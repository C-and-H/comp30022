package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

/**
 * Request body parameters for /user/changePhone.
 */
public class ChangePhoneRequest
{
    private String mobileNumber;

    public String getMobileNumber() {
        return this.mobileNumber;
    }
}
