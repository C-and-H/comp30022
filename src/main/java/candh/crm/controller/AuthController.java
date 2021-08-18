package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController
{
    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/signup")
    public ResponseEntity<?> signup() {
        return ResponseEntity.ok("This is the signup page.");
    }

    @GetMapping("/login")
    public ResponseEntity<?> login() {
        return ResponseEntity.ok("This is the login page.");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody User user) {
        if (authService.findUserByEmail(user.getEmail()) != null) {
            return ResponseEntity.ok("Email is already taken.");
        }
        try {
            authService.signupUser(new User(user.getEmail(), user.getPassword(), user.getFirst_name(),
                    user.getLast_name()));
        } catch (Exception e) {
            return ResponseEntity.ok("Something went wrong.");
        }
        return ResponseEntity.ok("You just successfully signed up.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.ok("Error during client authentication.");
        }
        return ResponseEntity.ok("You just successfully logged in.");
    }
}
