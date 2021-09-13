package candh.crm.controller;

import candh.crm.exception.FriendNotExistException;
import candh.crm.model.Contact;
import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.payload.request.contact.ChangeNotesRequest;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import candh.crm.service.ContactRelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@CrossOrigin("${crm.app.frontend.host}")
public class ContactController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRelationService contactRelationService;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Verify friendship between two users.
     *
     * @param byIdRequest  contains id of the friend
     * @return  false or contact relation of the user
     */
    @PostMapping("/friend/verifyFriendship")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> verifyFriendship(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        String friendId = byIdRequest.getId();
        Optional<User> friend = userRepository.findById(byIdRequest.getId());
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // verify
        Pair<Boolean,?> vrf = contactRelationService.verifyFriendship(userId, friendId);
        if (vrf.getFirst()) {
            @SuppressWarnings("unchecked")
            Pair<Contact,Contact> contacts = (Pair<Contact,Contact>) vrf.getSecond();
            // exclude second in response
            return ResponseEntity.ok(contacts.getFirst());
        }
        return ResponseEntity.ok(false);
    }

    /**
     * Handles Http Post for getting all friends of a user.
     */
    @PostMapping("/friend/listFriends")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> listFriends(
            @RequestHeader("Authorization") String headerAuth) {
        String id = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        return ResponseEntity.ok(contactRelationService.findAllFriends(id));
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
            @RequestHeader("Authorization") String headerAuth) {
        String id = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        return ResponseEntity.ok(contactRelationService.findAllSentRequests(id));
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
            @RequestHeader("Authorization") String headerAuth) {
        String id = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        return ResponseEntity.ok(contactRelationService.findAllReceivedRequests(id));
    }

    /**
     * Handles Http Post for sending request.
     *
     * @param byIdRequest  contains id of the friend
     */
    @PostMapping("/friend/sendRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendRequest(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        String friendId = byIdRequest.getId();
        Optional<User> friend = userRepository.findById(byIdRequest.getId());
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // send
        try {
            contactRelationService.sendRequest(userId, friendId);
            return ResponseEntity.ok("Request sent.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    /**
     * Handles Http Post for confirming request.
     *
     * @param byIdRequest  contains id of the friend
     */
    @PostMapping("/friend/confirmRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> confirmRequest(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        String friendId = byIdRequest.getId();
        Optional<User> friend = userRepository.findById(byIdRequest.getId());
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // confirm
        try {
            contactRelationService.confirmRequest(userId, friendId);
            return ResponseEntity.ok("Request confirmed.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    /**
     * Handles Http Post for declining request.
     *
     * @param byIdRequest  contains id of the friend
     */
    @PostMapping("/friend/declineRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> declineRequest(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        String friendId = byIdRequest.getId();
        Optional<User> friend = userRepository.findById(byIdRequest.getId());
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // decline
        try {
            contactRelationService.declineRequest(userId, friendId);
            return ResponseEntity.ok("Request declined.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    /**
     * Handles Http Post for cancelling request.
     *
     * @param byIdRequest  contains id of the friend
     */
    @PostMapping("/friend/cancelRequest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> cancelRequest(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        String friendId = byIdRequest.getId();
        Optional<User> friend = userRepository.findById(byIdRequest.getId());
        if (!friend.isPresent()) {
            return ResponseEntity.ok("Friend id not found.");
        }
        // cancel
        try {
            contactRelationService.cancelRequest(userId, friendId);
            return ResponseEntity.ok("Request cancelled.");
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }

    /**
     * Handles Http Post for friend deletion.
     * Before someone gets deleted, the initiator must be a friend of the person.
     *
     * @param byIdRequest  contains id of the friend
     */
    @PostMapping("/friend/delete")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteFriend(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ByIdRequest byIdRequest)
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        String friendId = byIdRequest.getId();
        try {
            // delete
            contactRelationService.deleteFriend(userId, friendId);
        } catch (FriendNotExistException e) {
            return ResponseEntity.ok(e.getMessage());
        }
        return ResponseEntity.ok("Friend deleted.");
    }

    /**
     * Handles Http Post for friend notes change.
     * Before someone's notes get changed, the initiator must be a friend of the person.
     */
    @PostMapping("/friend/changeNotes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeNotes(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ChangeNotesRequest changeNotesRequest)
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();
        String friendId = changeNotesRequest.getId();
        try {
            // change
            contactRelationService.changeNotes(userId, friendId,
                    changeNotesRequest.getNotes());
        } catch (FriendNotExistException e) {
            return ResponseEntity.ok(e.getMessage());
        }
        return ResponseEntity.ok("Notes changed.");
    }
}
