package candh.crm.payload.request.videoCall;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

public class CallNotAnswerRequest
{
    @NotBlank
    private String email;
    @NotBlank
    private String passwordEncoded;
    @NotBlank
    private String id;
}
