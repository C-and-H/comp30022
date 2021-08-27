package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /changeAreaOrRegion.
 */
public class ChangeAreaOrRegionRequest
{
    @NotBlank
    private String id;
    @NotBlank
    private String areaOrRegion;
}
