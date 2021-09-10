package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
<<<<<<< HEAD:backend/src/main/java/candh/crm/payload/request/user/ChangePhoneRequest.java
 * Request body parameters for /user/changePhone.
 */
public class ChangePhoneRequest
=======
 * Request body parameters for /user/addMobile and /user/deleteMobile.
 */
public class MobileRequest
>>>>>>> origin/sprint2-frontend-1.0-Contact:backend/src/main/java/candh/crm/payload/request/user/MobileRequest.java
{
    @NotBlank
    private String id;
    private String mobileNumber;

    public String getMobileNumber() {
        return this.mobileNumber;
    }


    public String getId() {
        return this.id;
    }
}
