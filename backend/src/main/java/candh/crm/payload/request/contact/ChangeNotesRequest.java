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
    /** id of the friend to change notes */
    @NotBlank
    private String id;
    @NotBlank
    private String notes;
}
