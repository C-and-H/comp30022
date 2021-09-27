package candh.crm.payload.request.chat;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Getter
@Setter

/**
 * Request body parameters for /chat/markAsRead.
 */
public class MarkAsReadRequest
{
    /** list of ids of messages to mark */
    @NotBlank
    List<String> ids;
}
