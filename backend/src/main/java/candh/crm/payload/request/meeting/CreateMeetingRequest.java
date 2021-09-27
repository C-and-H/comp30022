package candh.crm.payload.request.meeting;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter

/**
 * Request body parameters for /meeting/createMeeting.
 */
public class CreateMeetingRequest
{
    @NotNull
    private String[] participantIds;
    @NotBlank
    private String startTime;
    @NotBlank
    private String endTime;
    @NotBlank
    private String title;
    @NotNull
    private String notes;
}
