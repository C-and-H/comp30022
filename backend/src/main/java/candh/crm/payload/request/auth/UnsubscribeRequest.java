package candh.crm.payload.request.auth;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /logout.
 */
public class UnsubscribeRequest
{
    @NotBlank
    private String notificationPath;
}
