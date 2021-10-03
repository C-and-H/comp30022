package candh.crm.service;

import candh.crm.model.User;
import candh.crm.repository.UserRepository;
import candh.crm.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AuthService implements UserDetailsService
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private EmailService EmailService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    /**
     * Update or add a user to database, with the password encoded.
     *
     * @param user  a user object, that must contain email, password, first name, and last name
     * @param isEnabled  send a confirmation email if account is not enabled
     */
    public void updateUser(final User user, boolean isEnabled) throws MessagingException
    {
        Thread updateDb = new Thread(() -> {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userRepository.save(user);
        });
        Thread sendEmail = new Thread(() -> {
            try {
                EmailService.sendConfirmMail(user.getEmail(),
                        user.getFirst_name(), user.getSignupConfirmPath());
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        });
        // run
        updateDb.start();
        if (!isEnabled) sendEmail.start();
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return user;
        } else {
            throw new UsernameNotFoundException("email not found");
        }
    }

    /**
     * Check email entered follows the following rules.
     *
     * Domain name must include at least one dot.
     * The part of the domain name after the last dot can only consist of letters
     * Contain ‘@’ symbol.
     * Two dots can appear right next to each other in domain name.
     * First and last characters in the local part and in the domain name must not be dots.
     * The top-level domain (.com in these examples) must consist of two to six letters only.
     *
     * @param email  email address user entered
     */
    public boolean validEmail(String email) {
        String regex = "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    /**
     * Check password entered follows the following rules:
     * Length 5 to 10.
     * Only contain upper and lower case letter or numbers.
     *
     * @param password  password user entered
     */
    public boolean validPassword(String password) {
        String regex = "[A-Za-z0-9]{5,10}";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }

    /**
     * Using email as username.
     * Authenticate users and generate jwt web token.
     *
     * @param email  email address user entered
     * @param password  password user entered
     */
    public String authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtUtils.generateJwtToken(authentication);
    }
}
