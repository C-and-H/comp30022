package candh.crm.controller;

import candh.crm.model.Contact;
import candh.crm.model.User;
import candh.crm.service.ContactRelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class ContactController
{
    @Autowired
    private ContactRelationService contactRelationService;
/*
    @PostMapping("/contact/list")
    public ResponseEntity<?> listContact(@RequestBody User user) {

    }

    @PostMapping("/contact/")

    @PostMapping("/contact/request")

    @PostMapping("/contact/receive")

*/

    public ResponseEntity<?> sendRequest(@RequestBody Contact friendship) {
        Contact contact = contactRelationService
                .findByUserAndFriend(friendship.getUser(), friendship.getFriend());
        if (contact != null)
        {
            if (contact.isAccepted()) {
                return ResponseEntity.ok("Already friends.");
            } else {
                return ResponseEntity.ok("Request already sent but not yet confirmed.");
            }
        }
        contactRelationService.saveContact(
                new Contact(friendship.getUser(), friendship.getFriend()));
        contactRelationService.saveContact(
                new Contact(friendship.getFriend(), friendship.getUser()));

        return ResponseEntity.ok("Friend request sent.");
    }

    @PostMapping("/deleteFriend")
    public ResponseEntity<?> deleteFriend(@RequestBody Contact friendship) {
        Contact contact = contactRelationService
                .findByUserAndFriend(friendship.getUser(), friendship.getFriend());
        if (contact == null || !contact.isAccepted()) {
            return ResponseEntity.ok("Not friends yet.");
        }
        contactRelationService.deleteContact(
                friendship.getUser(), friendship.getFriend());
        contactRelationService.deleteContact(
                friendship.getFriend(), friendship.getUser());

        return ResponseEntity.ok("Friend delete.");
    }

    @GetMapping("/friendList/{email}")
    public List<Contact> friendList(@PathVariable() String email) {
        return contactRelationService.findAllFriends(email);
    }
}
