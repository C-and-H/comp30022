package candh.crm.controller;

import candh.crm.payload.request.EmailRequest;
import candh.crm.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@CrossOrigin("*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/email/sendEmail")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendEmail(@Valid @RequestBody EmailRequest emailRequest) {
        try {
            emailService.sendEmail(emailRequest.getReceiver(),
                    emailRequest.getSender(), emailRequest.getTitle(),
                    emailRequest.getContent());
            return ResponseEntity.ok("Email sent.");
        } catch(Exception e) {
            return ResponseEntity.ok("Something wrong, email not sent.");
        }
    }
}
