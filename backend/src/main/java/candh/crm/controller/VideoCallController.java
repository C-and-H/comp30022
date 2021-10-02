package candh.crm.controller;

import candh.crm.payload.request.videoCall.CallNotAnswerRequest;
import candh.crm.payload.request.videoCall.CallUserRequest;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import candh.crm.service.AuthService;
import candh.crm.service.VideoCallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Not authenticating based on jwt web token here,
 * to avoid expiration when using calls.
 */
@RestController
@CrossOrigin("${crm.app.frontend.host}")
public class VideoCallController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private VideoCallService videoCallService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/videoCall/callUser")
    public void callUser(
            @Valid @RequestBody CallUserRequest callUserRequest) {
        if (authService.authenticateUserSimple(callUserRequest.getEmail(),
                callUserRequest.getPasswordEncoded())) {   // authenticate
            videoCallService.call(callUserRequest.getId(),
                    userRepository.findByEmail(callUserRequest.getEmail()),
                    callUserRequest.getSignal());
        }
    }

    @PostMapping("/videoCall/answerCall")
    public void answerCall(
            @Valid @RequestBody CallUserRequest callUserRequest) {
        if (authService.authenticateUserSimple(callUserRequest.getEmail(),
                callUserRequest.getPasswordEncoded())) {   // authenticate
            videoCallService.answer(callUserRequest.getId(),
                    userRepository.findByEmail(callUserRequest.getEmail()),
                    callUserRequest.getSignal());
        }
    }

    @PostMapping("/videoCall/rejectCall")
    public void rejectCall(
            @Valid @RequestBody CallNotAnswerRequest callNotAnswerRequest) {
        if (authService.authenticateUserSimple(callNotAnswerRequest.getEmail(),
                callNotAnswerRequest.getPasswordEncoded())) {   // authenticate
            videoCallService.reject(callNotAnswerRequest.getId(),
                    userRepository.findByEmail(callNotAnswerRequest.getEmail()));
        }
    }

    @PostMapping("/videoCall/endCall")
    public void endCall(
            @Valid @RequestBody CallNotAnswerRequest callNotAnswerRequest) {
        if (authService.authenticateUserSimple(callNotAnswerRequest.getEmail(),
                callNotAnswerRequest.getPasswordEncoded())) {   // authenticate
            videoCallService.end(callNotAnswerRequest.getId(),
                    userRepository.findByEmail(callNotAnswerRequest.getEmail()));
        }
    }
}
