package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.service.AuthService;
import candh.crm.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class AuthController
{
    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserDataService userDataService;

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody User user) {
        // validate email and password format
        if (!authService.validEmail(user.getEmail())) {
            return ResponseEntity.ok("Email is not valid.");
        }
        if (!authService.validPassword(user.getPassword())) {
            return ResponseEntity.ok("Password is not valid.");
        }

        User _user = userDataService.findUserByEmail(user.getEmail());
        if (_user != null) {
            if (_user.isEnabled()) {
                return ResponseEntity.ok("Email is already taken.");
            } else {   // email taken but not confirmed
                userDataService.deleteUserByEmail(_user.getEmail());
            }
        }

        // save to database
        try {
            authService.signupUser(user);
        } catch (Exception e) {
            return ResponseEntity.ok("Error during user signup.");
        }
        return ResponseEntity.ok("You just successfully submit a signup request.");
    }

    @GetMapping("/signup/{email}/{signupConfirmPath}")
    public ResponseEntity<?> confirmUser(@PathVariable() String email,
                                         @PathVariable() String signupConfirmPath) {
        User user = userDataService.findUserByEmail(email);
        if (user != null && !user.isEnabled()) {
            user.setEnabled(true);   // confirm
            userDataService.saveUser(user);
            return ResponseEntity.ok("Signup confirm success.");
        } else {
            return ResponseEntity.ok("Signup confirm invalid or deprecated.");
        }
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestParam("email") String email,
                                            @RequestParam("oldPassword") String oldPassword,
                                            @RequestParam("newPassword") String newPassword) {
        // email should be enabled, then authenticate old password
        User user = userDataService.findUserByEmail(email);
        if (user == null || !user.isEnabled()) {
            return ResponseEntity.ok("Account not found or not enabled.");
        }
        if (!bCryptPasswordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.ok("Wrong old password.");
        }

        // validate new password format
        if (!authService.validPassword(newPassword)) {
            return ResponseEntity.ok("New password is not valid.");
        }
        if (oldPassword.equals(newPassword)) {
            return ResponseEntity.ok("New password is same as the old one.");
        }

        // save to database
        try {
            user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            userDataService.saveUser(user);
        } catch (Exception e) {
            return ResponseEntity.ok("Error during changing password.");
        }
        return ResponseEntity.ok("You just successfully changed password.");
    }
}
