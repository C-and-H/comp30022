package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter

/**
 * Request body parameters for /user/changeCompany.
 */
public class ChangeCompanyRequest
{
    @NotNull
    private String company;
}
