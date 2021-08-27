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
    @NotBlank
    private String email;
    @NotBlank
    private String first_name;
    @NotBlank
    private String last_name;
    @NotBlank
    private String areaOrRegion;
    @NotBlank
    private String industry;
}
