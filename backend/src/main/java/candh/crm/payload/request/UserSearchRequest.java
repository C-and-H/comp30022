package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /user/search.
 */
public class UserSearchRequest
{
    private String email;
    private String first_name;
    private String last_name;
    private String areaOrRegion;
    private String industry;
}
