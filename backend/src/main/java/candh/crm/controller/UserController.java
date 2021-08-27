package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.payload.request.AddMobileRequest;
import candh.crm.payload.request.ChangeRealNameRequest;
import candh.crm.payload.request.DeleteMobileRequest;
import candh.crm.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class UserController
{
    @Autowired
    private UserDataService userDataService;

    /**
     * Handles Http Post for user information query by id.
     */
    @PostMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> findUserById(@RequestParam("id") String id) {
        Optional<User> user = userDataService.findUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for user's real name change.
     */
    @PostMapping("/user/changeRealName")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeRealName(
            @Valid @RequestBody ChangeRealNameRequest changeRealNameRequest) {
        Optional<User> user = userDataService.findUserById(changeRealNameRequest.getId());
        if (user.isPresent()) {
            user.get().setFirst_name(changeRealNameRequest.getFirst_name());
            user.get().setLast_name(changeRealNameRequest.getLast_name());
            userDataService.saveUser(user.get());
            return ResponseEntity.ok("You just successfully changed your name.");
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for user to add a new mobile.
     */
    @PostMapping("/user/addMobile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addMobile(
            @Valid @RequestBody AddMobileRequest addMobileRequest) {
        Optional<User> user = userDataService.findUserById(addMobileRequest.getId());
        if (user.isPresent()) {
            user.get().addMobile(addMobileRequest.getMobileCountryCode(),
                    addMobileRequest.getMobileNumber());
            userDataService.saveUser(user.get());
            return ResponseEntity.ok("You just successfully added a new mobile.");
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for user to delete an existing mobile.
     */
    @PostMapping("/user/deleteMobile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteMobile(
            @Valid @RequestBody DeleteMobileRequest deleteMobileRequest) {
        String mobileCountryCode = deleteMobileRequest.getMobileCountryCode();
        String mobileNumber = deleteMobileRequest.getMobileNumber();

        Optional<User> user = userDataService.findUserById(deleteMobileRequest.getId());
        if (user.isPresent()) {
            if (user.get().hasMobile(mobileCountryCode, mobileNumber)) {
                user.get().deleteMobile(mobileCountryCode, mobileNumber);
                userDataService.saveUser(user.get());
                return ResponseEntity.ok("You just successfully deleted an existing mobile.");
            } else {
                return ResponseEntity.ok("Mobile not found.");
            }
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }
}
