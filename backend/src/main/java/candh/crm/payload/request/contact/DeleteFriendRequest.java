package candh.crm.payload.request.contact;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /contact/delete.
 */
public class DeleteFriendRequest
{
    @NotBlank
    private String userId;
    @NotBlank
    private String friendId;
}
