package candh.crm.controller;

import candh.crm.model.Contact;
import candh.crm.service.ContactRelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin("*")
public class ContactController {

    @Autowired
    private ContactRelationService contactRelationService;

    @PostMapping("/sendRequest")
    public ResponseEntity<?> sendRequest(String email, String friend) {
        Optional<Contact> contact = contactRelationService.findByUserAndFriend(email, friend);
        if (contact.isPresent()) {
            if (contact.get().isAccepted()) {
                return ResponseEntity.ok("Already friends.");
            } else {
                return ResponseEntity.ok("Request already sent but not yet confirmed.");
            }
        }

        contactRelationService.saveContact(new Contact(email, friend));
        contactRelationService.saveContact(new Contact(friend, email));

        return ResponseEntity.ok("Friend request sent.");
    }

    @PostMapping("/deleteFriend")
    public ResponseEntity<?> deleteFriend(String email, String friend) {
        Optional<Contact> contact = contactRelationService.findByUserAndFriend(email, friend);
        if (!contact.isPresent() || contact.get().isAccepted()) {
            return ResponseEntity.ok("Not friends yet.");
        }

        contactRelationService.deleteContact(email, friend);
        contactRelationService.deleteContact(friend, email);

        return ResponseEntity.ok("Friend delete.");
    }
}
