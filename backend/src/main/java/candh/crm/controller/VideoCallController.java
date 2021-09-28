package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.payload.request.videoCall.CallUserRequest;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import candh.crm.service.VideoCallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin("${crm.app.frontend.host}")
public class VideoCallController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private VideoCallService videoCallService;

    @PostMapping("/videoCall/callUser")
    @PreAuthorize("hasRole('USER')")
    public void callUser(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody CallUserRequest callUserRequest)
    {
        User sender = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        videoCallService.call(callUserRequest.getId(), sender, callUserRequest.getSignal());
    }

    @PostMapping("/videoCall/answerCall")
    @PreAuthorize("hasRole('USER')")
    public void answerCall(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody CallUserRequest callUserRequest)
    {
        User sender = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        videoCallService.answer(callUserRequest.getId(), sender, callUserRequest.getSignal());
    }

    @PostMapping("/videoCall/rejectCall")
    @PreAuthorize("hasRole('USER')")
    public void rejectCall(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        User sender = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        videoCallService.reject(byIdRequest.getId(), sender);
    }

    @PostMapping("/videoCall/endCall")
    @PreAuthorize("hasRole('USER')")
    public void endCall(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        User sender = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        videoCallService.end(byIdRequest.getId(), sender);
    }



}
