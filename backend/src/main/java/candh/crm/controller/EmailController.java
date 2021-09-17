package candh.crm.controller;

import candh.crm.payload.request.email.EmailRequest;
import candh.crm.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import candh.crm.security.JwtUtils;

import javax.validation.Valid;

@RestController
@CrossOrigin("${crm.app.frontend.host}")
public class EmailController
{
    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/email/sendEmail")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendEmail(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody EmailRequest emailRequest)
    {
        try {
            emailService.sendEmail(emailRequest.getReceiver(),
                    emailRequest.getSender(), emailRequest.getTitle(),
                    emailRequest.getContent(),
                    jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
            return ResponseEntity.ok("Email sent.");
        } catch(Exception e) {
            return ResponseEntity.ok("Something wrong, email not sent.");
        }
    }
}
