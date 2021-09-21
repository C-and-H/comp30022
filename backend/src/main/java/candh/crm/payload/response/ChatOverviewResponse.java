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
    /** id of the friend */
    private String id;
    /** full name of the friend */
    private String name;
    /** the latest message content */
    private String message;
    /** message sent time */
    private Date time;
    /** icon of the friend **/
    private String icon;
    /** number of unread messages */
    private Long unread;

    public ChatOverviewResponse(String id, String name, String message,
                                Date time, String icon, Long unread) {
        this.id = id;
        this.name = name;
        this.message = message;
        this.time = time;
        this.icon = icon;
        this.unread = unread;
    }
}
