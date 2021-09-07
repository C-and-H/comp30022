package candh.crm.controller;

import candh.crm.exception.FriendNotExistException;
import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.payload.request.contact.ChangeNotesRequest;
import candh.crm.payload.request.contact.FriendRequest;
import candh.crm.repository.UserRepository;
import candh.crm.service.ContactRelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class ContactController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRelationService contactRelationService;

    /**
     * Verify friendship between two users.
     */
    @PostMapping("/friend/verifyFriendship")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> verifyFriendship(
            @Valid @RequestBody FriendRequest friendRequest) {
        Optional<User> user = userRepository.findById(friendRequest.getUserId());
        Optional<User> friend = userRepository.findById(friendRequest.getFriendId());
        if (!user.isPresent()) {
            return ResponseEntity.ok("User id not found.");
        }
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // verify
        return ResponseEntity.ok(
                contactRelationService.verifyFriendship(friendRequest.getUserId(),
                friendRequest.getFriendId()).getFirst());
    }

    /**
     * Handles Http Post for getting all friends of a user.
     */
    @PostMapping("/friend/listFriends")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> listFriends(
            @Valid @RequestBody ByIdRequest byIdRequest) {
        Optional<User> user = userRepository.findById(byIdRequest.getId());
        if (user.isPresent()) {
            return ResponseEntity.ok(contactRelationService
                    .findAllFriends(byIdRequest.getId()));
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for getting all sent requests of a user
     * that has not been accepted yet (*including* the case of declined requests).
     *
     * @return  people's id.
     */
    @PostMapping("/friend/listSentRequests")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> listSentRequests(
            @Valid @RequestBody ByIdRequest byIdRequest) {
        Optional<User> user = userRepository.findById(byIdRequest.getId());
        if (user.isPresent()) {
            return ResponseEntity.ok(contactRelationService
                    .findAllSentRequests(byIdRequest.getId()));
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for getting all received requests of a user
     * that has not been accepted yet (*excluding* the case of declined requests).
     *
     * @return  people's id.
     */
    @PostMapping("/friend/listReceivedRequests")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> listReceivedRequests(
            @Valid @RequestBody ByIdRequest byIdRequest) {
        Optional<User> user = userRepository.findById(byIdRequest.getId());
        if (user.isPresent()) {
            return ResponseEntity.ok(contactRelationService
                    .findAllReceivedRequests(byIdRequest.getId()));
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for sending request.
     */
    @PostMapping("/friend/sendRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendRequest(
            @Valid @RequestBody FriendRequest friendRequest) {
        Optional<User> user = userRepository.findById(friendRequest.getUserId());
        Optional<User> friend = userRepository.findById(friendRequest.getFriendId());
        if (!user.isPresent()) {
            return ResponseEntity.ok("User id not found.");
        }
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // send
        try {
            contactRelationService.sendRequest(friendRequest.getUserId(),
                    friendRequest.getFriendId());
            return ResponseEntity.ok("Request sent.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    /**
     * Handles Http Post for confirming request.
     */
    @PostMapping("/friend/confirmRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> confirmRequest(
            @Valid @RequestBody FriendRequest friendRequest) {
        Optional<User> user = userRepository.findById(friendRequest.getUserId());
        Optional<User> friend = userRepository.findById(friendRequest.getFriendId());
        if (!user.isPresent()) {
            return ResponseEntity.ok("User id not found.");
        }
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // confirm
        try {
            contactRelationService.confirmRequest(friendRequest.getUserId(),
                    friendRequest.getFriendId());
            return ResponseEntity.ok("Request confirmed.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    /**
     * Handles Http Post for declining request.
     */
    @PostMapping("/friend/declineRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> declineRequest(
            @Valid @RequestBody FriendRequest friendRequest) {
        Optional<User> user = userRepository.findById(friendRequest.getUserId());
        Optional<User> friend = userRepository.findById(friendRequest.getFriendId());
        if (!user.isPresent()) {
            return ResponseEntity.ok("User id not found.");
        }
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // decline
        try {
            contactRelationService.declineRequest(friendRequest.getUserId(),
                    friendRequest.getFriendId());
            return ResponseEntity.ok("Request declined.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    /**
     * Handles Http Post for cancelling request.
     */
    @PostMapping("/friend/cancelRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> cancelRequest(
            @Valid @RequestBody FriendRequest friendRequest) {
        Optional<User> user = userRepository.findById(friendRequest.getUserId());
        Optional<User> friend = userRepository.findById(friendRequest.getFriendId());
        if (!user.isPresent()) {
            return ResponseEntity.ok("User id not found.");
        }
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // cancel
        try {
            contactRelationService.cancelRequest(friendRequest.getUserId(),
                    friendRequest.getFriendId());
            return ResponseEntity.ok("Request cancelled.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    /**
     * Handles Http Post for friend deletion.
     * Before someone gets deleted, the initiator must be a friend of the person.
     */
    @PostMapping("/friend/delete")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteFriend(
            @Valid @RequestBody FriendRequest friendRequest) {
        Optional<User> user = userRepository.findById(friendRequest.getUserId());
        if (user.isPresent()) {
            try {
                // delete
                contactRelationService.deleteFriend(friendRequest.getUserId(),
                        friendRequest.getFriendId());
            } catch (FriendNotExistException e) {
                return ResponseEntity.ok(e.getMessage());
            }
            return ResponseEntity.ok("Friend deleted.");
        }
        else {
            return ResponseEntity.ok("User id not found.");
        }
    }

    /**
     * Handles Http Post for friend notes change.
     * Before someone's notes get changed, the initiator must be a friend of the person.
     */
    @PostMapping("/friend/changeNotes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeNotes(
            @Valid @RequestBody ChangeNotesRequest changeNotesRequest) {
        Optional<User> user = userRepository.findById(changeNotesRequest.getUserId());
        if (user.isPresent()) {
            try {
                // change
                contactRelationService.changeNotes(changeNotesRequest.getUserId(),
                        changeNotesRequest.getFriendId(),
                        changeNotesRequest.getNotes());
            } catch (FriendNotExistException e) {
                return ResponseEntity.ok(e.getMessage());
            }
            return ResponseEntity.ok("Notes changed.");
        }
        else {
            return ResponseEntity.ok("User id not found.");
        }
    }
}
