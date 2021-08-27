package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /user/changeIndustry.
 */
public class ChangeIndustryRequest
{
    @NotBlank
    private String id;
    @NotBlank
    private String industry;
}
