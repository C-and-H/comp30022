package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.payload.request.*;
import candh.crm.repository.UserRepository;
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
    UserRepository userRepository;

    /**
     * Handles Http Post for user information query by id.
     */
    @PostMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> findUserById(
            @Valid @RequestBody ByIdRequest byIdRequest) {
        Optional<User> user = userRepository.findById(byIdRequest.getId());
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
        Optional<User> user = userRepository.findById(changeRealNameRequest.getId());
        if (user.isPresent()) {
            user.get().setFirst_name(changeRealNameRequest.getFirst_name());
            user.get().setLast_name(changeRealNameRequest.getLast_name());
            userRepository.save(user.get());
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
        Optional<User> user = userRepository.findById(addMobileRequest.getId());
        if (user.isPresent()) {
            user.get().addMobile(addMobileRequest.getMobileCountryCode(),
                    addMobileRequest.getMobileNumber());
            userRepository.save(user.get());
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

        Optional<User> user = userRepository.findById(deleteMobileRequest.getId());
        if (user.isPresent()) {
            if (user.get().hasMobile(mobileCountryCode, mobileNumber)) {
                user.get().deleteMobile(mobileCountryCode, mobileNumber);
                userRepository.save(user.get());
                return ResponseEntity.ok("You just successfully deleted an existing mobile.");
            } else {
                return ResponseEntity.ok("Mobile not found.");
            }
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for area/region change.
     */
    @PostMapping("/user/changeAreaOrRegion")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeAreaOrRegion(
            @Valid @RequestBody ChangeAreaOrRegionRequest changeAreaOrRegionRequest) {
        Optional<User> user = userRepository.findById(changeAreaOrRegionRequest.getId());
        if (user.isPresent()) {
            user.get().setAreaOrRegion(changeAreaOrRegionRequest.getAreaOrRegion());
            userRepository.save(user.get());
            return ResponseEntity.ok("You just successfully changed your area/region.");
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for user's working industry change.
     */
    @PostMapping("/user/changeIndustry")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeIndustry(
            @Valid @RequestBody ChangeIndustryRequest changeIndustryRequest) {
        Optional<User> user = userRepository.findById(changeIndustryRequest.getId());
        if (user.isPresent()) {
            user.get().setIndustry(changeIndustryRequest.getIndustry());
            userRepository.save(user.get());
            return ResponseEntity.ok("You just successfully changed your industry.");
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for searching users.
     * TODO
     */
//    @PostMapping("/user/search")
//    @PreAuthorize("hasRole('USER')")
//    public ResponseEntity<?> search(
//            @Valid @RequestBody UserSearchRequest userSearchRequest) {
//        return ResponseEntity.ok(userRepository.searchByKeywords(
//                userSearchRequest.getEmail(),
//                userSearchRequest.getFirst_name(),
//                userSearchRequest.getLast_name(),
//                userSearchRequest.getAreaOrRegion(),
//                userSearchRequest.getIndustry()));
//    }
}
