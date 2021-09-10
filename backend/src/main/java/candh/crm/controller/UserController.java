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

//    /**
//     * Handles Http Post for multiple users' information query by ids.
//     */
//    @PostMapping("/userMany")
//    @PreAuthorize("hasRole('USER')")
//    public ResponseEntity<?> findManyUsersByIds(
//            @RequestBody ByManyIdsRequest byManyIdsRequest) {
//        List<User> users = new ArrayList<>();
//        for (String id: byManyIdsRequest.getIds()) {
//            Optional<User> user = userRepository.findById(id);
//            if (user.isPresent()) {
//                users.add(user.get());
//            } else {
//                return ResponseEntity.ok("Id not found.");
//            }
//        }
//        return ResponseEntity.ok(users);
//    }

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
     * Handles Http Post for user to add a new phone number.
     */
    @PostMapping("/user/changePhone")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changePhone(
            @Valid @RequestBody ChangePhoneRequest changePhoneRequest) {
        Optional<User> user = userRepository.findById(changePhoneRequest.getId());
        if (user.isPresent()) {
            user.get().setPhone(changePhoneRequest.getMobileNumber());
            userRepository.save(user.get());
            return ResponseEntity.ok("You just successfully change your phone number.");
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
     *
     * @param searchRequest  multiple search keys
     *
     */
    @PostMapping("/user/search")
    @PreAuthorize("hasRole('USER')")
    public List<User> search(
            @Valid @RequestBody SearchRequest searchRequest)
            throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        // request fields
        Map<String,String> map = new HashMap<>();
        Method[] methods = SearchRequest.class.getMethods();
        String[] params = {"Email", "First_name", "Last_name",
                "AreaOrRegion", "Industry", "Company"};
        for (Method m: methods) {
            if (m.getName().startsWith("get") &&
                    Arrays.asList(params).contains(m.getName().substring(3))) {   // filter getters
                String value = (String) m.invoke(searchRequest);
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
                @SuppressWarnings("unchecked")
                List<User> _users = (List<User>) m.invoke(userRepository, value);
                if (users.isEmpty()) users = _users;
                else {   // intersection
                    users = _users.stream()
                            .filter(users::contains)
                            .collect(Collectors.toList());
                }
                if (_users.isEmpty()) break;   // no results found
            }
        }
        // remove user self
        return users.stream()
                .filter(u -> !u.getId().equals(searchRequest.getId()))
                .collect(Collectors.toList());
    }

    /**
     * Search through all "Email", "First_name", "Last_name",
     * "AreaOrRegion", "Industry", "Company" fields to find regex.
     *
     * @param sketchySearchRequest  one input search key
     *
     */
    @PostMapping("/user/sketchySearch")
    @PreAuthorize("hasRole('USER')")
    public List<User> sketchySearch(
            @Valid @RequestBody SketchySearchRequest sketchySearchRequest)
            throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        // request fields
        String[] params = {"Email", "First_name", "Last_name",
                "AreaOrRegion", "Industry", "Company"};
        ArrayList<User> users = new ArrayList<>();
        for (String field : params)
        {
            // query method
            Method m = UserRepository.class
                    .getDeclaredMethod("findBy_" + field, String.class);
            String value = sketchySearchRequest.getSearchKey();
            // search
            if (!value.equals("")) {
                @SuppressWarnings("unchecked")
                List<User> _users = (List<User>) m.invoke(userRepository, value);
                if (!_users.isEmpty()) users.addAll(_users);
            }
        }
        // remove duplicates
        ArrayList<User> results = new ArrayList<>();
        boolean add = true;
        for (int i = 0; i < users.size(); i++) {
            add = true;
            for (int j = 0; j<i; j++) {
                if (users.get(i).getId().equals(users.get(j).getId())) {
                    add = false;
                    break;
                }
            }
            if (add) {
                results.add(users.get(i));
            }
        }
        // remove user self
        return results.stream()
                .filter(u -> !u.getId().equals(sketchySearchRequest.getId()))
                .collect(Collectors.toList());
    }
}
