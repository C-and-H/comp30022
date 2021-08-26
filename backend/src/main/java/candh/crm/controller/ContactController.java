package candh.crm.controller;

import candh.crm.model.Contact;
import candh.crm.service.ContactRelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.List;

@RestController
@CrossOrigin("*")
public class ContactController
{
    @Autowired
    private ContactRelationService contactRelationService;

/*
    @PostMapping("/confirmFriendRequest")
    @PostMapping("/listSentFriendRequest")
    @PostMapping("/listReceivedFriendRequest")
*/

    @PostMapping("/sendFriendRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendRequest(@RequestBody Contact friendship) {
        Contact contact = contactRelationService
                .findByUserAndFriend(friendship.getUserEmail(), friendship.getFriendEmail());
        if (contact != null)
        {
            if (contact.isAccepted()) {
                return ResponseEntity.ok("Already friends.");
            } else {
                return ResponseEntity.ok("Request already sent but not yet confirmed.");
            }
        }
        contactRelationService.saveContact(
                new Contact(friendship.getUserEmail(), friendship.getFriendEmail()));
        contactRelationService.saveContact(
                new Contact(friendship.getFriendEmail(), friendship.getUserEmail()));

        return ResponseEntity.ok("Friend request sent.");
    }

    @PostMapping("/deleteFriend")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteFriend(@RequestBody Contact friendship) {
        Contact contact = contactRelationService
                .findByUserAndFriend(friendship.getUserEmail(), friendship.getFriendEmail());
        if (contact == null || !contact.isAccepted()) {
            return ResponseEntity.ok("Not friends yet.");
        }
        contactRelationService.deleteContact(
                friendship.getUserEmail(), friendship.getFriendEmail());
        contactRelationService.deleteContact(
                friendship.getFriendEmail(), friendship.getUserEmail());

        return ResponseEntity.ok("Friend delete.");
    }

    @PostMapping("/listFriend")
    @PreAuthorize("hasRole('USER')")
    public List<Contact> friendList(@PathParam("email") String email) {
        return contactRelationService.findAllFriends(email);
    }
}
