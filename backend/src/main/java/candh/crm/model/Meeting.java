package candh.crm.model;

import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@ToString

@Document(collection = "meeting")
public class Meeting
{
    @Id
    private String id;
    private String hostId;
    private String[] participantIds;
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date startTime;
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date endTime;
    private String title;
    private String notes;

    public Meeting(String hostId, String[] participantIds, Date startTime,
                   Date endTime, String title, String notes)
    {
        this.hostId = hostId;
        this.participantIds = participantIds;
        this.startTime = startTime;
        this.endTime = endTime;
        this.title = title;
        this.notes = notes;
    }

    public String getId() {
        return id;
    }

    public String getHostId() {
        return hostId;
    }

    public String[] getParticipantIds() {
        return participantIds;
    }

    public Date getStartTime() {
        return startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public String getTitle() {
        return title;
    }

    public String getNotes() {
        return notes;
    }

    public void setHostId(String hostId) {
        this.hostId = hostId;
    }

    public void setParticipantIds(String[] participantIds) {
        this.participantIds = participantIds;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
