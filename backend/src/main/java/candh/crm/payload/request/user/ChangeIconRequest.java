package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body for /user/changeIcon.
 */
public class ChangeIconRequest
{
    @NotBlank
    private String icon;
}
