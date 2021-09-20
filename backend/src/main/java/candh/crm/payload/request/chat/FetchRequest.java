package candh.crm.payload.request.chat;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /chat/fetch.
 */
public class FetchRequest
{
    /** id of the chat message sender */
    @NotBlank
    private String id;
    @NotBlank
    private String until;
}
