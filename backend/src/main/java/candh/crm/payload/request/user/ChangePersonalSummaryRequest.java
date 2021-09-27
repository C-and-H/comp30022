package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

/**
 * Request body parameters for /user/changePersonalSummary.
 */
public class ChangePersonalSummaryRequest
{
    private String personalSummary;

    public String getPersonalSummary() {
        return this.personalSummary;
    }

    public void setPersonalSummary(String personalSummary) {
        this.personalSummary = personalSummary;
    }
}
