package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.payload.request.ByIdRequest;
import candh.crm.payload.request.user.*;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
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
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // search fields
    private static final String[] params = {"Email", "First_name", "Last_name",
            "AreaOrRegion", "Industry", "Company"};

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
//            @Valid @RequestBody ByManyIdsRequest byManyIdsRequest) {
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
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ChangeRealNameRequest changeRealNameRequest)
    {
        User user = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        user.setFirst_name(changeRealNameRequest.getFirst_name());
        user.setLast_name(changeRealNameRequest.getLast_name());
        userRepository.save(user);
        return ResponseEntity.ok(
                "You just successfully changed your name.");
    }

    /**
     * Handles Http Post for user to add a new phone number.
     */
    @PostMapping("/user/changePhone")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changePhone(
            @RequestHeader("Authorization") String headerAuth,
            @RequestBody ChangePhoneRequest changePhoneRequest)
    {
        User user = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        user.setPhone(changePhoneRequest.getMobileNumber());
        userRepository.save(user);
        return ResponseEntity.ok(
                "You just successfully change your phone number.");
    }

    /**
     * Handles Http Post for user's area/region change.
     */
    @PostMapping("/user/changeAreaOrRegion")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeAreaOrRegion(
            @RequestHeader("Authorization") String headerAuth,
            @RequestBody ChangeAreaOrRegionRequest changeAreaOrRegionRequest)
    {
        User user = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        user.setAreaOrRegion(changeAreaOrRegionRequest.getAreaOrRegion());
        userRepository.save(user);
        return ResponseEntity.ok(
                "You just successfully changed your area/region.");
    }

    /**
     * Handles Http Post for user's working industry change.
     */
    @PostMapping("/user/changeIndustry")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeIndustry(
            @RequestHeader("Authorization") String headerAuth,
            @RequestBody ChangeIndustryRequest changeIndustryRequest)
    {
        User user = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        user.setIndustry(changeIndustryRequest.getIndustry());
        userRepository.save(user);
        return ResponseEntity.ok(
                "You just successfully changed your industry.");
    }

    /**
     * Handles Http Post for user's company change.
     */
    @PostMapping("/user/changeCompany")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeCompany(
            @RequestHeader("Authorization") String headerAuth,
            @RequestBody ChangeCompanyRequest changeCompanyRequest)
    {
        User user = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        user.setCompany(changeCompanyRequest.getCompany());
        userRepository.save(user);
        return ResponseEntity.ok(
                "You just successfully changed your company.");
    }

    /**
     * Handles Http Post for user's personal summary change.
     */
    @PostMapping("/user/changePersonalSummary")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changePersonalSummary(
            @RequestHeader("Authorization") String headerAuth,
            @RequestBody ChangePersonalSummaryRequest changePersonalSummaryRequest)
    {
        User user = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)));
        user.setPersonalSummary(changePersonalSummaryRequest.getPersonalSummary());
        userRepository.save(user);
        return ResponseEntity.ok(
                "You just successfully changed your personal summary.");
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
            @RequestHeader("Authorization") String headerAuth,
            @RequestBody SearchRequest searchRequest)
            throws NoSuchMethodException, InvocationTargetException, IllegalAccessException
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();

        Map<String,String> map = new HashMap<>();
        Method[] methods = SearchRequest.class.getMethods();
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
                .filter(u -> !u.getId().equals(userId))
                .collect(Collectors.toList());
    }

    /**
     * Search through all "Email", "First_name", "Last_name",
     * "AreaOrRegion", "Industry", "Company" fields to find regex.
     *
     * @param sketchySearchRequest  one input search key
     */
    @PostMapping("/user/sketchySearch")
    @PreAuthorize("hasRole('USER')")
    public List<User> sketchySearch(
            @RequestHeader("Authorization") String headerAuth,
            @RequestBody SketchySearchRequest sketchySearchRequest)
            throws NoSuchMethodException, InvocationTargetException, IllegalAccessException
    {
        String userId = userRepository.findByEmail(
                jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth)))
                .getId();

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
                .filter(u -> !u.getId().equals(userId))
                .collect(Collectors.toList());
    }
}
