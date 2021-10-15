package candh.crm.payload.request.email;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter

/**
 * Request body parameters for /email/sendEmail.
 */
public class SendEmailRequest
{
    @NotBlank
    private String receiver;
    @NotBlank
    private String sender;
    @NotNull
    private String title;
    @NotNull
    private String content;
}
