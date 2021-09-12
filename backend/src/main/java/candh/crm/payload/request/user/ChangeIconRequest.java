package candh.crm.payload.request.user;

import javax.validation.constraints.NotBlank;

public class ChangeIconRequest
{
    @NotBlank
    private String id;
    private String icon;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
