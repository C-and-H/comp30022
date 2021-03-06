package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.payload.request.auth.*;
import candh.crm.payload.response.LoginResponse;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import candh.crm.service.AuthService;
import candh.crm.service.WebSocketSubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin("${crm.app.frontend.host}")
public class AuthController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private AuthService authService;

    @Autowired
    private WebSocketSubscriptionService webSocketSubscriptionService;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Handles Http Post for login authentication.
     * Check account status, verify password, generate jwt token.
     * Respond with token, id, and user's email address.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginAndGenerateJwtToken(
            @Valid @RequestBody LoginRequest loginRequest)
    {
        // check account status
        User user = userRepository.findByEmail(loginRequest.getUsername());
        if (user == null) return ResponseEntity.ok("Email not found.");
        if (!user.isEnabled()) return ResponseEntity.ok("Account not enabled.");

        // verify password and generate jwt token
        try {
            String jwt = authService.authenticateUser(loginRequest.getUsername(),
                    loginRequest.getPassword());
            return ResponseEntity.ok(
                    new LoginResponse(jwt, user.getId(), user.getEmail()));
        }
        catch (Exception e) {
            return ResponseEntity.ok("Wrong password!");
        }
    }

    /**
     * Validates if jwt token has expired.
     */
    @PostMapping("/jwt/checkExpired")
    public boolean jwtExpired(
            @Valid @RequestBody CheckExpirationRequest checkExpirationRequest) {
        return jwtUtils.validateJwtToken(checkExpirationRequest.getAuthToken());
    }

    /**
     * Handles Http Post for account signup.
     * Requires a form body specifying email, password, first_name, and last_name.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user)
    {
        // validate email and password format
        if (!authService.validEmail(user.getEmail())) {
            return ResponseEntity.ok("Email is not valid.");
        }
        if (!authService.validPassword(user.getPassword())) {
            return ResponseEntity.ok("Password is not valid.");
        }

        synchronized (this) {
            // existing by user email
            User _user = userRepository.findByEmail(user.getEmail());
            if (_user != null) {
                if (_user.isEnabled()) {
                    return ResponseEntity.ok("Email is already taken.");
                } else {   // email taken but not confirmed
                    userRepository.delete(_user);
                }
            }
            // save to database
            try {
                authService.updateUser(new User(user.getEmail(), user.getPassword(),
                        user.getFirst_name(), user.getLast_name()), false);
            } catch (Exception e) {
                return ResponseEntity.ok("Error during user signup.");
            }
        }
        return ResponseEntity.ok("You just successfully submit a signup request.");
    }

    /**
     * Handles Http Get for account activation.
     * By requesting this page, set a non-enabled user to enabled state.
     */
    @GetMapping("/signup/{email}/{signupConfirmPath}")
    public ResponseEntity<?> confirmSignup(@PathVariable() String email,
                                           @PathVariable() String signupConfirmPath) {
        User user = userRepository.findByEmail(email);
        if (user != null && !user.isEnabled() &&
                user.getSignupConfirmPath().equals(signupConfirmPath)) {
            user.setEnabled(true);   // confirm
            userRepository.save(user);
            return ResponseEntity.ok("Signup confirm success.");
        } else {
            return ResponseEntity.ok("Signup confirm invalid or deprecated.");
        }
    }

    /**
     * Handles a Http Post for user password change.
     */
    @PostMapping("/changePassword")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String headerAuth,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest)
    {
        String oldPassword = changePasswordRequest.getOldPassword();
        String newPassword = changePasswordRequest.getNewPassword();
        String email = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(headerAuth));

        // validate new password format
        if (!authService.validPassword(newPassword)) {
            return ResponseEntity.ok("New password is not valid.");
        }
        if (oldPassword.equals(newPassword)) {
            return ResponseEntity.ok("New password is same as the old one.");
        }

        User user = userRepository.findByEmail(email);
        if (!bCryptPasswordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.ok("Wrong old password.");
        }

        // save to database
        try {
            user.setPassword(newPassword);
            authService.updateUser(user, true);
        } catch (Exception e) {
            return ResponseEntity.ok("Error during changing password.");
        }
        return ResponseEntity.ok("You just successfully changed password.");
    }
}
