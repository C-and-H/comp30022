package candh.crm.payload.request.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /user/changePersonalSummary.
 */
public class ChangePersonalSummaryRequest
{
    @NotBlank
    private String id;
    private String personalSummary;

    public String getPersonalSummary() {
        return this.personalSummary;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setPersonalSummary(String personalSummary) {
        this.personalSummary = personalSummary;
    }
}
