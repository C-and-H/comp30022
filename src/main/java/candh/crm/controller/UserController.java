package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController
{
    @Autowired
    private UserDataService userDataService;

    @GetMapping("/user/findUserByEmail/{email}")
    public ResponseEntity<?> findUserByEmail(@PathVariable() String email) {
        User user = userDataService.findUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.ok("Email not found.");
        }
    }
}
