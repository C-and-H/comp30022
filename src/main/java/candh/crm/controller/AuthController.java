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
@CrossOrigin("*")
public class AuthController
{
    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody User user) {
        String email = user.getEmail();
        String password = user.getPassword();
        String first_name = user.getFirst_name();
        String last_name = user.getLast_name();
        try {
            authService.signupUser(new User(email, password, first_name, last_name));
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
