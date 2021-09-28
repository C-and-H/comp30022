package candh.crm.payload.request.videoCall;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

public class CallUserRequest
{
    @NotBlank
    private String id;
    @NotBlank
    private String signal;
}
