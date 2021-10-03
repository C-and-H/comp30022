package candh.crm.service;

import candh.crm.model.Meeting;
import candh.crm.repository.MeetingRepository;
import candh.crm.repository.UserRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MeetingService
{
    @Autowired
    private MeetingRepository meetingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    /**
     * @param id  id of the user
     * @return  all meetings in user's calendar, either as a host or a participant
     */
    public List<Meeting> meetingList(String id) {
        List<Meeting> meetings = meetingRepository.findByHostId(id);
        meetings.addAll(meetingRepository.findBy_participantId(id));
        return meetings;
    }

    public void createMeeting(String hostId, String[] participantIds, Date startTime,
                              Date endTime, String title, String notes) throws Exception
    {
        if (!userRepository.findById(hostId).isPresent()) {
            throw new Exception("HostId not found.");
        }
        else if (!validIds(participantIds)) {
            throw new Exception("ParticipantId not found.");
        }
        else
        {
            Set<String> set = new HashSet<>();
            Collections.addAll(set, participantIds);
            set.remove(hostId);
            meetingRepository.save(new Meeting(hostId, set.toArray(new String[0]),
                    startTime, endTime, title, notes));
            if (set.size() > 0)
            {
                // send email
                try {
                    Thread sendEmail = new Thread(new Runnable() {
                        @SneakyThrows
                        @Override
                        public void run() {
                            emailService.meetingInvitation(hostId, set.toArray(new String[0]),
                                    startTime, endTime, title, notes);
                        }
                    });
                    sendEmail.start();
                } catch (RuntimeException e) {
                    throw e;
                }
                // send notification
                Thread notify = new Thread(() -> {
                    for (String participantId : set) {
                        notificationService
                                .createReceiveMeetingInvitationNotification(participantId, hostId);
                    }
                });
                notify.start();
            }
        }
    }

    public void deleteMeeting(String meetingId, String userId) throws Exception
    {
        Optional<Meeting> meeting = meetingRepository.findById(meetingId);
        if (meeting.isPresent()) {
            Meeting event = meeting.get();
            // remove the meeting if host cancels it
            if (userId.equals(event.getHostId())) {
                meetingRepository.delete(event);
            }
            // if participant cancels just remove the id from the list
            else {
                String[] participants = event.getParticipantIds();
                if (containId(participants, userId)) {
                    String[] newParticipants = new String[participants.length-1];
                    int i = 0;
                    for (String participantId : participants) {
                        if (!participantId.equals(userId)) {
                            newParticipants[i] = participantId;
                            i++;
                        }
                    }
                    event.setParticipantIds(newParticipants);
                    meetingRepository.save(event);
                } else {
                    throw new Exception("User does not participant in the meeting.");
                }
            }
        }
        else {
            throw new Exception("Meeting not found.");
        }
    }

    /**
     * Fetch all meetings from 12 hours ago to 12 hours ahead.
     */
    public List<Meeting> recent(String id) {
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        calendar.add(Calendar.HOUR_OF_DAY, -12);
        Date start = calendar.getTime();
        calendar.add(Calendar.HOUR_OF_DAY, 24);
        Date end = calendar.getTime();
        return meetingRepository.findRecent(id, start, end);
    }

    /**
     * Check whether all ids in array present in user database.
     */
    private boolean validIds(String[] participantIds)
    {
        for (String participantId : participantIds) {
            if (!userRepository.findById(participantId).isPresent()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check whether id in array
     */
    private boolean containId(String[] participantIds, String Id)
    {
        for (String participantId : participantIds) {
            if (participantId.equals(Id)) {
                return true;
            }
        }
        return false;
    }
}
