package candh.crm.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class EmailRequest {

    @NotBlank
    private String receiver;

    @NotBlank
    private String sender;

    @NotBlank
    private String title;

    @NotBlank
    private String content;
}
