package candh.crm.payload.request.chat;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter

/**
 * Request body parameters for /chat/sendText.
 */
public class SendTextRequest
{
    /** id of the receiver */
    @NotBlank
    private String id;
    @NotNull
    private String message;
}
