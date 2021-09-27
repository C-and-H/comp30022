package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter

/**
 * Request body parameters for /user/search.
 */
public class SearchRequest
{
    @NotNull
    private String email;
    @NotNull
    private String first_name;
    @NotNull
    private String last_name;
    @NotNull
    private String areaOrRegion;
    @NotNull
    private String industry;
    @NotNull
    private String company;
}
