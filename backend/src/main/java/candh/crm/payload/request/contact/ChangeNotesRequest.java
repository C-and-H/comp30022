package candh.crm.payload.request.contact;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

/**
 * Request body parameters for /contact/changeNotes.
 */
public class ChangeNotesRequest
{
    @NotBlank
    private String userId;
    @NotBlank
    private String friendId;
    
    private String notes;
}
