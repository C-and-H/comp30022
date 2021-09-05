package candh.crm.payload.request.contact;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /contact/withdrawRequest,
 * /contact/confirmRequest, /contact/refuseRequest and /contact/delete.
 */
public class FriendRequest
{
    @NotBlank
    private String userId;
    @NotBlank
    private String friendId;
}
