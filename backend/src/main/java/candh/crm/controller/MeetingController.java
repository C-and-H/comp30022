package candh.crm.controller;

import candh.crm.payload.request.ByIdRequest;
import candh.crm.payload.request.meeting.CreateMeetingRequest;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import candh.crm.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@CrossOrigin("${crm.app.frontend.host}")
public class MeetingController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MeetingService meetingService;

    @PostMapping("/meeting/createMeeting")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createMeeting(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody CreateMeetingRequest createMeetingRequest)
    {
        String hostId = userRepository.findByEmail(
                        jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();

        Date startTime, endTime;
        try {
            startTime = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
                    .parse(createMeetingRequest.getStartTime());
            endTime = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
                    .parse(createMeetingRequest.getEndTime());
        } catch (ParseException e) {
            e.printStackTrace();
            return ResponseEntity.ok("Invalid time format.");
        }

        try {
            meetingService.createMeeting(hostId, createMeetingRequest.getParticipantIds(),
                    startTime, endTime, createMeetingRequest.getTitle(),
                    createMeetingRequest.getNotes());
            return ResponseEntity.ok("Meeting created.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    @PostMapping("/meeting/deleteMeeting")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteMeeting(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        String id = userRepository.findByEmail(
                        jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        try {
            meetingService.deleteMeeting(byIdRequest.getId(), id);
            return ResponseEntity.ok("Meeting deleted.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    @GetMapping("/meeting/listMeeting")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> listMeeting(
            @RequestHeader("Authorization") String headerAuth)
    {
        String id = userRepository.findByEmail(
                        jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        return ResponseEntity.ok(meetingService.meetingList(id));
    }



}
