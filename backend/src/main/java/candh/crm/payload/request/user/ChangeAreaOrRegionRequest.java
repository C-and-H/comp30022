package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

/**
 * Request body parameters for /user/changeAreaOrRegion.
 */
public class ChangeAreaOrRegionRequest
{
    private String areaOrRegion;

    public String getAreaOrRegion(){
        return this.areaOrRegion;
    }
}
