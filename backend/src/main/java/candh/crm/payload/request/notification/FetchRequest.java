package candh.crm.payload.request.notification;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Getter
@Setter

/**
 * Request body parameters for /notification/fetch.
 */
public class FetchRequest
{
    @NotBlank
    private String userId;
    @NotBlank
    private List<String> notificationIds;
}
