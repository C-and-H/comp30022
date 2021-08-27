package candh.crm.controller;

import candh.crm.model.Contact;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.service.ContactRelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin("*")
public class ContactController
{
    @Autowired
    private ContactRelationService contactRelationService;

/*
    @PostMapping("/friend/confirmRequest")
    @PostMapping("/friend/listSentRequests")
    @PostMapping("/friend/listReceivedRequests")
*/

    @PostMapping("/friend/sendRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendRequest(@RequestBody Contact friendship) {
        Contact contact = contactRelationService
                .findByUserAndFriend(friendship.getUserId(), friendship.getFriendId());
        if (contact != null)
        {
            if (contact.isAccepted()) {
                return ResponseEntity.ok("Already friends.");
            } else {
                return ResponseEntity.ok("Request already sent but not yet confirmed.");
            }
        }
        contactRelationService.saveContact(
                new Contact(friendship.getUserId(), friendship.getFriendId()));
        contactRelationService.saveContact(
                new Contact(friendship.getFriendId(), friendship.getUserId()));

        return ResponseEntity.ok("Friend request sent.");
    }

    @PostMapping("/friend/delete")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteFriend(@RequestBody Contact friendship) {
        Contact contact = contactRelationService
                .findByUserAndFriend(friendship.getUserId(), friendship.getFriendId());
        if (contact == null || !contact.isAccepted()) {
            return ResponseEntity.ok("Not friends yet.");
        }
        contactRelationService.deleteContact(
                friendship.getUserId(), friendship.getFriendId());
        contactRelationService.deleteContact(
                friendship.getFriendId(), friendship.getUserId());

        return ResponseEntity.ok("Friend delete.");
    }

    @PostMapping("/friend/listFriends")
    @PreAuthorize("hasRole('USER')")
    public List<Contact> friendList(
            @Valid @RequestBody ByIdRequest byIdRequest) {
        return contactRelationService.findAllFriends(byIdRequest.getId());
    }
}
