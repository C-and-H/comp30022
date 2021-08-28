package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.payload.request.user.*;
import candh.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

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
     * Handles Http Post for user's area/region change.
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
     * Handles Http Post for user's company change.
     */
    @PostMapping("/user/changeCompany")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeCompany(
            @Valid @RequestBody ChangeCompanyRequest changeCompanyRequest) {
        Optional<User> user = userRepository.findById(changeCompanyRequest.getId());
        if (user.isPresent()) {
            user.get().setCompany(changeCompanyRequest.getCompany());
            userRepository.save(user.get());
            return ResponseEntity.ok("You just successfully changed your company.");
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for user's personal summary change.
     */
    @PostMapping("/user/changePersonalSummary")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changePersonalSummary(
            @Valid @RequestBody ChangePersonalSummaryRequest changePersonalSummaryRequest) {
        Optional<User> user = userRepository.findById(changePersonalSummaryRequest.getId());
        if (user.isPresent()) {
            user.get().setPersonalSummary(changePersonalSummaryRequest.getPersonalSummary());
            userRepository.save(user.get());
            return ResponseEntity.ok("You just successfully changed your personal summary.");
        } else {
            return ResponseEntity.ok("Id not found.");
        }
    }

    /**
     * Handles Http Post for searching users.
     *
     * Partial search is case-insensitive, and based on regex.
     * At least one field should be non-empty.
     */
    @PostMapping("/user/search")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> search(
            @Valid @RequestBody UserSearchRequest userSearchRequest)
            throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        // request fields
        Map<String,String> map = new HashMap<>();
        Method[] methods = UserSearchRequest.class.getMethods();
        List<String> params = List.of("Email", "First_name", "Last_name",
                "AreaOrRegion", "Industry", "Company");
        for (Method m: methods) {
            if (m.getName().startsWith("get") &&
                    params.contains(m.getName().substring(3))) {   // filter getters
                String value = (String) m.invoke(userSearchRequest);
                map.put(m.getName().substring(3), value);
            }
        }

        List<User> users = new ArrayList<>();
        for (String field : map.keySet())
        {
            // query method
            Method m = UserRepository.class
                    .getDeclaredMethod("findBy_" + field, String.class);
            String value = map.get(field);
            // search
            if (!value.equals("")) {
                List<User> _users = (List<User>) m.invoke(userRepository, value);
                if (users.isEmpty()) users = _users;
                else {   // intersection
                    users = _users.stream().filter(users::contains)
                            .collect(Collectors.toList());
                }
                if (_users.isEmpty()) break;   // no results found
            }
        }
        return ResponseEntity.ok(users);
    }
}
