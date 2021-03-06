package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

public class ByIdRequest
{
    @NotBlank
    private String id;

    public ByIdRequest() { }

    public ByIdRequest(String id) {
        this.id = id;
    }
}
