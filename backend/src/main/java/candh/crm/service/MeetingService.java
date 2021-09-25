package candh.crm.service;

import candh.crm.model.Meeting;
import candh.crm.repository.MeetingRepository;
import candh.crm.repository.UserRepository;
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
    private EmailService emailService;

    /**
     * @param Id ID of user
     * @return All meetings in user's calendar
     */
    public List<Meeting> meetingList(String Id)
    {
        List<Meeting> meetings = meetingRepository.findByHostId(Id);
        meetings.addAll(meetingRepository.findBy_participantId(Id));
        return meetings;
    }

    public void createMeeting(String hostId, String[] participantIds, Date startTime,
                              Date endTime, String title, String notes) throws Exception
    {
        if (!userRepository.findById(hostId).isPresent()) {
            throw new Exception("HostId not found.");
        } else if (!validIds(participantIds)) {
            throw new Exception("ParticipantId not found.");
        } else {
            Set<String> set = new HashSet<>();
            Collections.addAll(set, participantIds);
            set.remove(hostId);
            meetingRepository.save(new Meeting(hostId, set.toArray(new String[0]),
                    startTime, endTime, title, notes));
            if (set.size() > 0) {
                emailService.meetingInvitation(hostId, set.toArray(new String[0]),
                        startTime, endTime, title, notes);
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
             // if participant cancels just remove the id from the list
            } else {
                List<String> participants = Arrays.asList(event.getParticipantIds());
                if (participants.contains(userId)) {
                    participants.remove(userId);
                    event.setParticipantIds(participants.toArray(new String[0]));
                    meetingRepository.save(event);
                } else {
                    throw new Exception("User does not participant in the meeting.");
                }

            }
        } else {
            throw new Exception("Meeting not found.");
        }
    }

    /**
     * check whether all ids in array present in user database
     */
    private boolean validIds (String[] participantIds)
    {
        for (String participantId : participantIds) {
            if (!userRepository.findById(participantId).isPresent()) {
                return false;
            }
        }
        return true;
    }



}
