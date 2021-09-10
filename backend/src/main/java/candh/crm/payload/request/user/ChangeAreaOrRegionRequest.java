package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /user/changeAreaOrRegion.
 */
public class ChangeAreaOrRegionRequest
{
    @NotBlank
    private String id;
    private String areaOrRegion;

    public String getId() {
        return this.id;
    }

    public String getAreaOrRegion(){
        return this.areaOrRegion;
    }
}
