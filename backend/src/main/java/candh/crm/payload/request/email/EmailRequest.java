package candh.crm.payload.request.email;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /email/sendEmail.
 */
public class EmailRequest
{
    @NotBlank
    private String receiver;
    @NotBlank
    private String sender;
    @NotBlank
    private String title;
    @NotBlank
    private String content;
}
