package candh.crm.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter

/**
 * Response body parameters for /chat/overview.
 */
public class ChatOverviewResponse
{
    /** id of the sender */
    private String id;
    /** the latest message content */
    private String message;
    /** message sent time */
    private Date time;
    /** number of unread messages */
    private Long unread;

    public ChatOverviewResponse(String id, String message, Date time, Long unread) {
        this.id = id;
        this.message = message;
        this.time = time;
        this.unread = unread;
    }
}
