package candh.crm.service;

import candh.crm.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService
{
    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private EmailService EmailService;

    @Autowired
    private UserDataService userDataService;

    public void signupUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        EmailService.sendConfirmMail(user.getEmail(), user.getName());
        userDataService.saveUser(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDataService.findUserByEmail(email);
        if (user != null) {
            return user;
        } else {
            throw new UsernameNotFoundException("email not found");
        }
    }
}
